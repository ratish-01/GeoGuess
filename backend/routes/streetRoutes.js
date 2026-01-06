const express = require("express");
const router = express.Router();
const { getRandomStreet } = require("../controllers/streetController");

router.get("/random", getRandomStreet);

module.exports = router;
