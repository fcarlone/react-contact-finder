const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Add a route
app.get("/", (req, res) => {
  res.json({ msg: "Welcome" });
});

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacs", require("./routes/contacts"));
app.use("/api/users", require("./routes/users"));

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
