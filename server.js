const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy credentials (Replace with real database credentials)
const USERS = {
  testUser: "password123",
};

// Login Endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (USERS[username] && USERS[username] === password) {
    return res.json({ token: "dummy-token" });
  } else {
    return res.status(401).send("Invalid credentials");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
