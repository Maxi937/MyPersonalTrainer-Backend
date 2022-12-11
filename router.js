"use strict";

const express = require('express');
const router = express.Router();
const admin = require('./controllers/admin')
const client = require('./controllers/client')
const home = require('./controllers/home')
const about = require('./controllers/about')
const accounts = require('./controllers/accounts')
const dashboard = require('./controllers/dashboard')

// Admin
router.get("/admin", admin.index);
router.get("/admin/admin-clients", admin.adminClients);
router.get("/admin/client/:id", admin.client)
router.get("/admin/client/:id/deedBox/:deedBoxId", admin.index) // TODO: DeedBox View
router.get("/admin/newDeedBox", admin.newDeedBox)
router.post("/admin/addDeedBox", admin.addDeedBox)
router.get("/admin/assigndeedbox/:securityId", admin.assignDeedBox)

// Home
router.get("/", home.index);

// Error
router.get("/error500", home.error500)

// About
router.get("/about", about.index);

// login
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

//Client Security
router.get('/client/registersecurity', client.newSecurity)
router.post('/client/registersecurity', client.registerSecurity)
//router.get("/user", user.index)
//router.get("/user/edituserdetails", user.editUserDetails)
//router.post("/user/updateuserdetails", user.updateUserDetails)

// Station
//router.get("/station/:id", station.index);
//router.get("/station/:id/deletereading/:readingId", station.deleteReading);
//router.post("/station/:id/addreading", station.addReading);
//router.get("/station/:id/addAutoReading", station.addAutoReading)

// Dashboard
router.get("/dashboard", dashboard.index);
//router.get("/dashboard/deletestation/:id", dashboard.deleteStation);
//router.post("/dashboard/addstation", dashboard.addStation);
//router.get("/dashboard/:id/addAutoReading", dashboard.addAutoReading)

// DeedLockerPi
router.get("/deedlockerPi/test", deedlockerPi.test)


module.exports = router;