import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const myPersonalTrainerService = {
  url: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.url}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.url}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.url}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.url}/api/users`);
    return res.data;
  },
};
