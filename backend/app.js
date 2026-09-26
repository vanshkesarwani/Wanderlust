if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const apiRouter = require("./routes/api.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) return;
  await mongoose.connect(dbUrl);
  isConnected = true;
  console.log("Connected to DB");
}

connectDB().catch((err) => {
  console.error("DB Connection Error:", err.message);
});

// Trust reverse proxy (essential for Vercel & HTTPS secure cookies)
app.set("trust proxy", 1);

// Middleware: ensure database connection is active in serverless environments
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// CORS Middleware (handles credentials & preflight requests for React frontend)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongo Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "wanderlustsecretkey",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("ERROR in MONGO SESSION STORE", err);
});

const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

const sessionOptions = {
  store,
  secret: process.env.SECRET || "wanderlustsecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
  },
};

app.use(session(sessionOptions));

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mount REST API Router
app.use("/api", apiRouter);

// Health check / root info
app.get("/", (req, res) => {
  res.json({
    name: "Wanderlust REST API",
    status: "online",
    endpoints: {
      listings: "/api/listings",
      auth: "/api/auth/current-user",
      config: "/api/config"
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 8080;
// Only start listening when not running inside a serverless platform (Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
