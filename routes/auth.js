const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

const User = require("../models/User.js");
// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  // res.send("Get logged in user");
  try {
    // Get user from database - mongoDB
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // Check email
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      // Check input password vs. stored password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      // Send JWT
      const payload = {
        user: {
          id: user.id
        }
      };
      // JWT sign-in
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // Catch error
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
