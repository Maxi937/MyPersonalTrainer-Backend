"use strict"

const mongoose = require('mongoose')
const logger = require("./logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    if (process.env.NODE_ENV === 'development') {
      logger.info(`MongoDB Connected: ${conn.connection.host}`)
    }
    
  } catch (err) {

    if (process.env.NODE_ENV === 'development') {
      logger.err(`Failed to connect to MongoDB: ${err.message}`)
    }
    process.exit(1)
  }
}

module.exports = connectDB