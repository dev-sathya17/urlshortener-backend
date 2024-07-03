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
      const identifier = `https://urlshortener-backend-40am.onrender.com/urls/${generateIdentifier()}`;

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
  // API for getting count of urls per date.
  getUrlCount: async (req, res) => {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    try {
      const counts = await Url.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);
      res.status(200).json(counts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // API to get url count for current day
  getCurrentDayCount: async (req, res) => {
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth();
      const year = today.getFullYear();

      const count = await Url.countDocuments({
        createdAt: {
          $gte: new Date(year, month, day),
          $lt: new Date(year, month, day + 1),
        },
      });

      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  //API to redirect the url
  redirectUrl: async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const identifierPattern = new RegExp(`^.*${identifier}$`, "i");

      const url = await Url.findOne({
        identifier: { $regex: identifierPattern },
      });
      if (!url) {
        return res.status(404).send({ message: "Url not found" });
      }

      return res.redirect(url.url);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};

module.exports = urlsController;
