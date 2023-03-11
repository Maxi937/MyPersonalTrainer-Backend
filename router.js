"use strict";

const express = require('express');
const router = express.Router();
const home = require('./controllers/home')


// Home
router.get("/", home.index);

// Error
router.get("/error500", home.error500)

module.exports = router;