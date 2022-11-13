"use strict";

const logger = require("../config/logger");
const _ = require("lodash");
const User = require("./User");

const userStore = {
  getAllUsers() {
    const filter = {};
    return User.find(filter).lean()
  },

  addUser(user)  {
    const User = new User(user)
    User.save()
      .then((result) => {
        logger.info('User added Successfully');
      })
      .catch((err) => {
        logger.error(err);
      });
  }

 /* getUserById(id) {
 /   return this.store.findOneBy(this.collection, { id: id });
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
  */
};

module.exports = userStore;