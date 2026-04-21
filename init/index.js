const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";



main()
  .then(() => {
    console.log("Connected to db");
    initDB(); // call after connection
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOURL);
}


const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = initData.data.map((obj) => ({
    ...obj,// inserting the owner id 
    owner: "69df3a9e6870719c75379a6e",
  }));

  await Listing.insertMany(updatedData);

  console.log("Data was initialized");
};