// Importing mongoose library
const mongoose = require("mongoose");

// Importing values from config
const { MONGODB_URI, PORT } = require("./utils/config");

// Importing the express app
const app = require("./app");

// Connecting to mongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });
