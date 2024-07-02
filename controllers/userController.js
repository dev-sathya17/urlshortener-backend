// Importing bcrypt library to encrypt the password
const bcrypt = require("bcrypt");

// Importing the user model
const User = require("../models/user");

// Importing the JWT library to generate tokens
const jwt = require("jsonwebtoken");

// Importing the secret key
const { SECRET_KEY } = require("../utils/config");

// Importing the email transporter
const transporter = require("../utils/transporter");

// Importing the email id from config
const { EMAIL_ID } = require("../utils/config");

// Importing the user helper function to generate an auth string
const { generateRandomString } = require("../helpers/userHelper");

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

      // Sending email
      transporter.sendMail({
        from: EMAIL_ID,
        to: email,
        subject: "Activate your account",
        text: `Click here to reset your password: localhost:3000/users/activate/${user._id}`,
      });

      // Sending a success response
      res.status(201).json({
        message:
          "Your account has been created successfully. Check your email to activate your account.",
        user,
      });
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

      // if the user is not active, return an error response
      if (!user.isActive) {
        return res.status(403).send({ message: "User account is not active" });
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

  // Function to logout a user
  logout: async (req, res) => {
    try {
      // clearing the cookie
      res.clearCookie("token");

      // sending a success response
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // Activate user
  activateUser: async (req, res) => {
    try {
      // Fetching the id from url params
      const { id } = req.params;

      // Checking if the id is valid
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Updating the user status to active
      user.isActive = true;
      await user.save();

      // Sending a success response
      res.status(200).send({ message: "User activated successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for sending email for the user when user wants to reset password
  forgotPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Generating auth string
      const authString = generateRandomString();

      // Update user
      user.authString = authString;
      await user.save();

      // Send email
      transporter.sendMail({
        from: EMAIL_ID,
        to: email,
        subject: "Password Reset",
        text: `Click here to reset your password: localhost:3000/users/verify/${authString}`,
      });

      // Sending a success response
      res.status(200).json({
        message: "Password reset link has been sent to your email address",
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
  // API for verifying the user auth string
  authVerify: async (req, res) => {
    try {
      // Extracting values from request params
      const { authString } = req.params;

      // Checking if this auth string is of a valid user
      const user = await User.findOne({ authString });
      if (!user) {
        return res.status(404).json({ message: "Auth string does not match!" });
      }

      // Sending a success response
      res.status(200).json({
        message: "Auth String verified successfully",
        email: user.email,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
  // API for resetting password
  resetPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email, password } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user
      user.password = hashedPassword;
      user.authString = "";
      await user.save();

      // Sending a success response
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
