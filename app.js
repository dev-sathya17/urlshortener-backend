// Importing the express library
const express = require("express");

// Importing the router
const userRouter = require("./routes/userRoutes");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

// Creating the express app
const app = express();

// parse the cookies of the request
app.use(cookieParser());

// Adding a middleware to parse request body as json
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/users", userRouter);

// Exporting the express app.
module.exports = app;
