const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Importation des routes
const deviceRoutes = require("./routes/devices");
app.use("/api/devices", deviceRoutes);

module.exports = app;
