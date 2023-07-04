import axios from "axios";
import { serviceUrl } from "../fixtures.js";
import { createTestLogger } from "../../src/utility/logger.js";

const logger = createTestLogger();

logger.info(`Service Url: ${serviceUrl}`);

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

  async authenticate(user) {
    const res = await axios.post(`${this.url}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    return res.data;
  },

  async clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },

  async addLocalImage(form) {
    const res = await axios.post(`${this.url}/api/photos/local`, form);
    return res.data;
  },

  async addUserImage(form) {
    const res = await axios.post(`${this.url}/api/profile/photos`, form);
    return res.data;
  },

  async getUserImages() {
    const res = await axios.get(`${this.url}/api/profile/photos`);
    return res.data;
  },

  async deleteAllImages() {
    const res = await axios.delete(`${this.url}/api/photos`);
    return res.data;
  },
};
