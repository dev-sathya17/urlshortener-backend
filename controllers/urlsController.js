// Importing Urls model
const Url = require("../models/url");

// Importing helper function
const { generateIdentifier } = require("../helpers/urlHelper");

// Creating a urls controller
const urlsController = {
  // Function to shorten the URL
  shortenUrl: async (req, res) => {
    try {
      // Fetching the url from the request body
      const { url } = req.body;

      // Checking if the url is already shortened by the user
      const existingUrl = await Url.findOne({ url });
      if (existingUrl) {
        return res.status(409).send({ message: "Url already shortened" });
      }
      // Generating a shorted url
      const identifier = `localhost:3000/${generateIdentifier()}`;

      // Creating a new URL object
      const shortenedUrl = new Url({ url, identifier, user: req.userId });

      // Saving the URL to the database
      await shortenedUrl.save();

      // Sending a success response
      return res
        .status(201)
        .send({ message: "Url shortened successfully", shortenedUrl });
    } catch (error) {
      // Sending an error response
      return res.status(500).send({ message: error.message });
    }
  },
  // API to view all urls created by the user.
  viewUserUrls: async (req, res) => {
    try {
      // Fetching all URLs created by the user from the database
      const urls = await Url.find({ user: req.userId });
      // Sending a success response
      return res.status(200).send({ urls });
    } catch (error) {
      // Sending an error response
      return res.status(500).send({ message: error.message });
    }
  },
};

module.exports = urlsController;
