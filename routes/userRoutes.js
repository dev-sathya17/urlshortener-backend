// Importing the express library
const express = require("express");

// Importing the user Controller
const userController = require("../controllers/userController");

// Creating a router
const userRouter = express.Router();

// Route to register a user
userRouter.post("/", userController.register);

// Route for user login
userRouter.post("/login", userController.login);

// Exporting the router
module.exports = userRouter;
