// Importing the dotenv
require("dotenv").config();

// Extracting values from .env file
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Exporting the values as an object
module.exports = {
  MONGODB_URI,
  PORT,
};
