import axios from "axios";
import { start } from "../src/server/server.js";
import { loadconfig } from "../config/loadconfig.js";

loadconfig();
export const server = await start();
export const serviceUrl = process.env.url;

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return error.response
    } 
    console.log("error");
    return Promise.reject(error);
  }
);

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
