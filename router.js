"use strict";

const express = require("express");
const router = express.Router();

const home = require("./controllers/home")


//index
router.get("/", home.index);

module.exports = router;