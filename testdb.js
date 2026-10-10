require('dotenv').config();
const mongoose = require('mongoose');

console.log("URI:", process.env.ATLASDB_URL);

async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("✅ Connected to DB successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.log("❌ Connection failed:", err.message);
  }
}

main();