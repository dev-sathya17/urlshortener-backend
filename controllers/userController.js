// Importing bcrypt library to encrypt the password
const bcrypt = require("bcrypt");

// Importing the user model
const User = require("../models/user");

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
};

module.exports = userController;
