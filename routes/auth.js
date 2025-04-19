const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user.js"); // ⬅️ This was wrong in your code

// Register
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    res.redirect("/login.html");
  } catch (err) {
    console.error("Signup error:", err); // Add error logging
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", req.body);

  try {
    const user = await User.findOne({ email }).select("+password"); // ⬅️ was `user.findOne`, which is wrong
    console.log(user);
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).send("Invalid credentials");

    req.session.user = user;
    res.redirect("/home.html"); // ⬅️ You had `res.redirect = "/home.html";` (wrong syntax)
  } catch (err) {
    console.error("Login error:", err); // Add error logging
    res.status(500).send("Server error");
  }
  //console.log()
});

module.exports = router;
