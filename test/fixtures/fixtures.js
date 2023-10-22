import { start } from "../../src/server/server.js";
import { loadconfig } from "../../config/loadconfig.js";

loadconfig();
export const serviceUrl = "http://localhost:4000";
export const server = await start();

export const adminUser = {
  email: process.env.ADMINISTRATOR_EMAIL,
  password: process.env.ADMINISTRATOR_PASSWORD,
};

export const maggie = {
  fname: "Maggie",
  lname: "Simpson",
  email: "maggie@simpson.com",
  password: "secret",
};

export const kiki = {
  fname: "Kiki",
  lname: "Trainer",
  email: "Kiki@Trainer.com",
  password: "secret",
  displayName: "kikiFit",
};

export const testTrainers = [
  {
    fname: "Ray",
    lname: "McDowan",
    email: "Ray@Trainer.com",
    password: "secret",
    displayName: "RayFit",
  },
  {
    fname: "Lorna",
    lname: "Morna",
    email: "lorna@Trainer.com",
    password: "secret",
    displayName: "lornaFit",
  },
  {
    fname: "Dillon",
    lname: "Frank",
    email: "Dillon@Trainer.com",
    password: "secret",
    displayName: "DillonFit",
  },
];

export const testUsers = [
  {
    fname: "Homer",
    lname: "Simpson",
    email: "homer@simpson.com",
    password: "secret",
  },
  {
    fname: "Marge",
    lname: "Simpson",
    email: "marge@simpson.com",
    password: "secret",
  },
  {
    fname: "Bart",
    lname: "Simpson",
    email: "bart@simpson.com",
    password: "secret",
  },
];
