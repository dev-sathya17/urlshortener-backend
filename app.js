// Importing the express library
const express = require("express");

// Importing the router
const userRouter = require("./routes/userRoutes");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Creating the express app
const app = express();

// Adding a middleware to parse request body as json
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/users", userRouter);

// Exporting the express app.
module.exports = app;
