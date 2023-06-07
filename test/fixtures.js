import * as dotenv from "dotenv";

const config = dotenv.config({ path: "./config/dev.env" });

export const serviceUrl = process.env.url;

export const adminUser = {
  email: process.env.ADMINISTRATOR_EMAIL,
  password: process.env.ADMINISTRATOR_PASSWORD
}

export const maggie = {
  fname: "Maggie",
  lname: "Simpson",
  email: "maggie@simpson.com",
  password: "secret",
  role: "user"
};

export const maggieCredentials = {
  email: "maggie@simpson.com",
  password: "secret",
};

export const barry = {
  fname: "Barry",
  lname: "Block",
  email: "barry@simpson.com",
  password: "secret",
  role: "user"
};

export const testUsers = [
  {
    fname: "Homer",
    lname: "Simpson",
    email: "homer@simpson.com",
    password: "secret",
    role: "user"
  },
  {
    fname: "Marge",
    lname: "Simpson",
    email: "marge@simpson.com",
    password: "secret",
    role: "user"
  },
  {
    fname: "Bart",
    lname: "Simpson",
    email: "bart@simpson.com",
    password: "secret",
    role: "user"
  }
];
