const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { fullname, email, password, role, phoneNumber } = req.body;

  try {
    // Create a new user instance
    const user = new User({ fullname, email, password, role, phoneNumber });

    // Save the user to the database (will trigger Mongoose validations)
    await user.save();
    res.status(200).json({
      status: 200,
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle validation and duplicate errors
    if (error.name === "ValidationError") {
      // Collect all validation errors and respond
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors });
    }

    if (error.code === 11000) {
      // Extract the field that caused the duplicate key error
      const duplicateField = Object.keys(error.keyPattern)[0];

      // Return specific error messages based on the field
      const errorMessage = duplicateField === "email"
        ? "Email already exists"
        : duplicateField === "phoneNumber"
          ? "Phone number already exists"
          : "Duplicate key error";

      return res.status(400).json({ error: errorMessage });
    }
    // Handle other errors
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password, userType } = req.body;

  // Validate userType
  const validUserTypes = ['Job Seeker', 'Employer']; 
  if (!validUserTypes.includes(userType)) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  // Find user by email and role
  const user = await User.findOne({ email, role: userType });

  // Check if user exists and if password matches
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } 
  );
  const expiry = Date.now() + 3600000;
  const { password: _, ...userData } = user.toObject();

  // Send success response
  res.status(200).json({
    status: 200,
    message: "Login successful",
    user: userData,
    token,
    expiry
  });
};

