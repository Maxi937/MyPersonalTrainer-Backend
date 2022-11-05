"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const deedStore = {
  store: new JsonStore("./models/deed-store.json", {
    deedCollection: [],
  }),
  collection: "deedCollection",

  getAllDeedBox() {
    return this.store.findAll(this.collection);
  },

  getDeedBox(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserDeedBoxes(clientId) {
    const result = this.store.findBy(this.collection, { clientId: clientId })
    console.log(result)
    return result;
  },

  addDeedBox(deedBox) {
    this.store.add(this.collection, deedBox);
    this.store.save();
  },

  removeDeedBox(id) {
    const deedBox = this.getDeedBox(id);
    this.store.remove(this.collection, deedBox);
    this.store.save();
  },

  removeAllDeedBox() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  removeLocation(id, locationId) {
    const deedBox = this.getDeedBox(id);
    const locations = DeedBox.locations;
    _.remove(locations, { id: locationId });
    this.store.save();
  },

  addLocation(id, location) {
    const deedBox = this.getDeedBox(id);
    deedBox.location.push(location);
    this.store.save();
  },
};

module.exports = deedStore;