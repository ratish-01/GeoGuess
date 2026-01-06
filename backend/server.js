require("dotenv").config();
const express = require("express");
const cors = require("cors");
const streetRoutes = require("./routes/streetRoutes");

const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use("/api/street", streetRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
