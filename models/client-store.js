"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const clientStore = {
  store: new JsonStore("./models/client-store.json", { clients: [] }),
  collection: "clients",

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getClientByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  updateUser(user, updatedUser) {
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.email = updatedUser.email;
    user.password = updatedUser.password;
    this.store.save();
  }
};

module.exports = clientStore;