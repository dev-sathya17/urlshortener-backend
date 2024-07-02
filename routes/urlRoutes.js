// Importing the express library
const express = require("express");

// Importing the auth middleware
const auth = require("../middlewares/auth");

// Importing the urls controller
const urlsController = require("../controllers/urlsController");

// Creating a router object
const urlRouter = express.Router();

// Route to shorten a url
urlRouter.post("/shorten", auth.authenticate, urlsController.shortenUrl);

// Route to view all created urls
urlRouter.get("/", auth.authenticate, urlsController.viewUserUrls);

// Exporting the router
module.exports = urlRouter;
