// Importing bcrypt library to encrypt the password
const bcrypt = require("bcrypt");

// Importing the user model
const User = require("../models/user");

// Importing the JWT library to generate tokens
const jwt = require("jsonwebtoken");

// Importing the secret key
const { SECRET_KEY } = require("../utils/config");

// Creating a user controller
const userController = {
  // Function to register a user
  register: async (req, res) => {
    try {
      // Destructuring the request body
      const { firstName, lastName, email, password } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      // Saving the user to the database
      await user.save();

      // Sending a success response
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // Function to login a user
  login: async (req, res) => {
    try {
      // getting the user email and password from the request body
      const { email, password } = req.body;

      // checking if the user exists in the database
      const user = await User.findOne({ email });

      // if the user does not exist, return an error response
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // if the user exists check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // if the password is invalid, return an error response
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      // generating a JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      // setting the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
      });

      // sending a success response
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      // sending an error response
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = userController;
