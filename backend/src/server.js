const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDB } = require("./db");
const createTables = require("./setupTables");

const app = express();
app.use(cors());
app.use(express.json());

// Test route for Postman
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

async function startServer() {
  console.log("Initializing DB...");
  await initDB();

  console.log("Creating tables...");
  await createTables();

  console.log("Starting server...");
  app.listen(process.env.PORT, () => {
    console.log(`Backend running on http://localhost:${process.env.PORT}`);
  });
}

startServer();
