if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("DB ERROR:", err); 
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//Index Route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
    res.send("Error loading listings");
  }
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      return res.send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.log(err);
    res.send("Error loading listing");
  }
});

//Create Route
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send("Error creating listing");
  }
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    console.log(err);
    res.send("Error editing listing");
  }
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    res.send("Error updating listing");
  }
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send("Error deleting listing");
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});