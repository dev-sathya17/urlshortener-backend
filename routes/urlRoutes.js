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

// Route to view count of urls per date
urlRouter.get("/count", auth.authenticate, urlsController.getUrlCount);

// Route to get today's url count
urlRouter.get(
  "/todayCount",
  auth.authenticate,
  urlsController.getCurrentDayCount
);

urlRouter.get("/:identifier", auth.authenticate, urlsController.redirectUrl);
// Exporting the router
module.exports = urlRouter;
