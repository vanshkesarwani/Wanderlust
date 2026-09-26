# 🌍 Wanderlust — Full-Stack Vacation Rental Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL-000000?logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Storage-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**Wanderlust** is an Airbnb-inspired full-stack vacation rental and accommodation marketplace. It allows travelers to discover unique stays worldwide and enables hosts to list and manage their properties. Built with a modern **React (Vite) Single Page Application** on the frontend and an **Express.js + MongoDB** REST API on the backend, featuring Cloudinary cloud image uploads and interactive Mapbox geocoding.

---

## ✨ Features

### 🏡 Listings Management (CRUD)
- **Explore Stays:** Browse properties with high-resolution imagery, pricing, and location details.
- **Category Filter:** Filter by tags like *Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic, Domes, Boats*.
- **Search:** Search properties by title, destination, city, or country.
- **Tax Display Toggle:** Instant switch to preview total prices including taxes (+18% GST).
- **Host a Place:** Authenticated users can list their property with photos uploaded directly to Cloudinary.
- **Edit & Delete:** Listing owners can modify details or remove their property.

### 🗺️ Interactive Maps & Geocoding
- **Automatic Geocoding:** Converts address/location inputs into geographic coordinates `[longitude, latitude]` via **Mapbox Geocoding SDK**.
- **Interactive Map View:** Pinpoints exact stay location with custom popups using **Mapbox GL JS**.

### 🌟 Reviews & Ratings
- **Customer Reviews:** Leave ratings (1 to 5 stars) and detailed reviews.
- **Review Deletion:** Review authors have permission to delete their own reviews.
- **Cascade Deletion:** Removing a listing automatically removes all associated reviews.

### 🔐 Authentication & Authorization
- **User Accounts:** Secure registration, login, and session persistence via **Passport.js**.
- **Role Permissions:** Non-owners cannot edit or delete listings or reviews belonging to others.
- **Authentication Modals:** Seamless login/signup modal without losing browsing context.

---

## 🏗️ Project Architecture

```
Wanderlust/
├── backend/                  # Express.js REST API
│   ├── init/                 # Database seed script & dummy data
│   ├── models/               # Mongoose schemas (Listing, Review, User)
│   ├── routes/               # API endpoints (/api/listings, /api/auth, /api/reviews)
│   ├── utils/                # ExpressError, wrapAsync helpers
│   ├── cloudConfig.js        # Cloudinary configuration
│   ├── middleware.js         # Auth & validation middlewares
│   ├── schema.js             # Joi input validation schemas
│   ├── app.js                # Express app entry & session configuration
│   └── .env.example          # Sample environment variables
│
├── frontend/                 # React SPA (Vite)
│   ├── public/               # Favicon and SVGs
│   ├── src/
│   │   ├── api/              # Axios instance with credentials
│   │   ├── components/       # Navbar, Footer, ListingCard, Map, AuthModal, CategoryFilter
│   │   ├── context/          # AuthContext (user session state)
│   │   ├── pages/            # ListingsPage, ListingDetailPage, NewListingPage, EditListingPage
│   │   ├── App.jsx           # React Router and main layout
│   │   ├── index.css         # Custom modern design system
│   │   └── main.jsx          # React DOM entry point
│   ├── index.html
│   └── vite.config.js        # Vite config with /api reverse proxy
│
├── .gitignore
├── package.json              # Root scripts to run both servers
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Maps:** [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- **Icons:** FontAwesome & Custom SVG
- **Styling:** Modern Vanilla CSS (Flexbox, CSS Grid, Glassmorphism, Micro-animations)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (v20+)
- **Server Framework:** [Express.js](https://expressjs.com/) (v5)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication:** [Passport.js](http://www.passportjs.org/) + `passport-local-mongoose`
- **Session Storage:** `express-session` with `connect-mongo`
- **File Uploads:** `multer` & `cloudinary`
- **Validation:** [Joi](https://joi.dev/) schema validator
- **Location Services:** `@mapbox/mapbox-sdk`

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster
- [Cloudinary](https://cloudinary.com/) free account (for image hosting)
- [Mapbox](https://www.mapbox.com/) free account (for maps & geocoding)

---

### 1. Clone the Repository
```bash
git clone https://github.com/vanshkesarwani/wanderlust.git
cd wanderlust
```

---

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update the keys with your credentials:
```env
PORT=8080
NODE_ENV=development

# Database (Local MongoDB or Atlas URI)
ATLASDB_URL=mongodb://127.0.0.1:27017/wanderlust

# Session Secret
SECRET=your_super_secret_session_key

# Cloudinary Credentials
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox Token
MAP_TOKEN=your_mapbox_public_token
```

---

### 3. Install Dependencies

You can install dependencies for both root, backend, and frontend:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

---

### 4. Seed the Database (Optional but Recommended)

To populate the database with initial listings:
```bash
cd backend
node init/index.js
cd ..
```
*Creates sample listings with images and assigns them to a default demo user.*

---

### 5. Run the Application

You can run both backend and frontend from the root directory or separately:

#### Option A: Running from Root
```bash
# Start backend API (Port 8080)
npm run backend

# In a separate terminal, start frontend dev server (Port 5173/5174)
npm run frontend
```

#### Option B: Running individually
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit the frontend in your browser:
---

## ⚡ Deployment to Vercel

The project is configured for 1-click deployment on [Vercel](https://vercel.com/) via `vercel.json` and `api/index.js` (Serverless Node.js backend + Vite React SPA frontend).

### Steps to Deploy:

1. **Push your code to GitHub** (already set up on `main` branch).
2. Go to **[vercel.com](https://vercel.com/)** and log in with your GitHub account.
3. Click **"Add New..."** ➔ **"Project"**.
4. Import your **`Wanderlust`** repository from GitHub.
5. In the **Configure Project** screen:
   - **Framework Preset:** Vite (or Other)
   - **Root Directory:** `./` (leave default)
   - **Build and Output Settings:** Automatically managed by `vercel.json`
6. Expand **Environment Variables** and add the following keys:
   | Variable | Value Description |
   | :--- | :--- |
   | `ATLASDB_URL` | Your MongoDB Atlas connection URI (`mongodb+srv://...`) |
   | `SECRET` | Long random session secret key |
   | `CLOUD_NAME` | Cloudinary cloud name |
   | `CLOUD_API_KEY` | Cloudinary API key |
   | `CLOUD_API_SECRET` | Cloudinary API secret |
   | `MAP_TOKEN` | Public Mapbox access token |
   | `NODE_ENV` | `production` |
7. Click **"Deploy"**!
8. Once deployed, Vercel provides a live URL (e.g., `https://wanderlust-yourname.vercel.app`).

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/auth/current-user` | Returns the currently authenticated user | No |
| `POST` | `/api/auth/signup` | Register a new user and log in | No |
| `POST` | `/api/auth/login` | Authenticate existing user | No |
| `POST` | `/api/auth/logout` | Terminate session | Yes |

### 🏡 Listings (`/api/listings`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/listings` | Fetch all listings (supports `?category=` & `?search=`) | No |
| `GET` | `/api/listings/:id` | Get details and reviews of a specific listing | No |
| `POST` | `/api/listings` | Create a new listing (with image upload) | Yes |
| `PUT` | `/api/listings/:id` | Update listing details or replace image | Yes (Owner) |
| `DELETE` | `/api/listings/:id` | Delete listing and its reviews | Yes (Owner) |

### 💬 Reviews (`/api/listings/:id/reviews`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/listings/:id/reviews` | Post a rating and review on a listing | Yes |
| `DELETE` | `/api/listings/:id/reviews/:reviewId` | Delete a review | Yes (Author) |

---

## 🔒 Security & Best Practices

- **Joi Data Validation:** Requests are validated against rigorous schemas before hitting database handlers.
- **Session Protection:** Session cookies are secured with `httpOnly`, `sameSite`, and configurable `maxAge`.
- **CORS Handling:** Strict origin checking allowing credentials for React client communication.
- **Error Handling:** Centralized async wrapper `wrapAsync` and custom `ExpressError` class for consistent error responses.
- **Environment Isolation:** Credentials stored securely in `.env` and kept out of version control.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/vanshkesarwani">Vansh Kesarwani</a>
</p>
