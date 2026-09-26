const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main () {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await main();
  console.log("Connected to DB");
  await Listing.deleteMany({});
  let user = await User.findOne({ username: "demouser" });
  if (!user) {
    user = new User({ email: "demouser@gmail.com", username: "demouser" });
    user = await User.register(user, "demouser123");
  }
  initData.data = initData.data.map((obj) => ({
    ...obj, 
    owner: user._id,
    geometry: obj.geometry || {
      type: "Point",
      coordinates: [77.2090, 28.6139]
    }
  }));
  await Listing.insertMany(initData.data);
  console.log("Data inserted successfully!");
  await mongoose.connection.close();
};

initDB().catch((err) => {
  console.log(err);
});
