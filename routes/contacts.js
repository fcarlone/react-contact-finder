const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc    Get all user's contacts
// @access  Private
router.get("/", auth, async (req, res) => {
  // res.send("Get all contacts");
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // res.send("Get all contacts");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      // Save contact to database
      const contact = await newContact.save();

      // Return contact to the client
      res.json(contact);

      // Catch error
    } catch (error) {
      console.error(error.messag);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put("/:id", auth, async (req, res) => {
  // res.send("Update a contact");

  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Verify user owns contact
    if (contact.user != req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Update contact in database
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
    // Catch error
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  // res.send("Delete contact");

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    // Verify user owns contact
    if (contact.user != req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete in contact in database
    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact removed" });
    // Catch error
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
