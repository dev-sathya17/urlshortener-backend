// Importing the dotenv
require("dotenv").config();

// Extracting values from .env file
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_ID = process.env.EMAIL_ID;
const APP_PASSWORD = process.env.APP_PASSWORD;

// Exporting the values as an object
module.exports = {
  MONGODB_URI,
  PORT,
  SECRET_KEY,
  EMAIL_ID,
  APP_PASSWORD,
};
