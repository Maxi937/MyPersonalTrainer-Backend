import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const pintAccountantService = {
  pintAccountantUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.pintAccountantUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.pintAccountantUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.pintAccountantUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.pintAccountantUrl}/api/users`);
    return res.data;
  },

  async createReview(review) {
    const res = await axios.post(`${this.pintAccountantUrl}/api/reviews`, review);
    return res.data;
  },

  async getReview(id) {
    const res = await axios.get(`${this.pintAccountantUrl}/api/reviews/${id}`);
    return res.data;
  },

  async getAllReviews() {
    const res = await axios.get(`${this.pintAccountantUrl}/api/reviews`);
    return res.data;
  },

  async deleteAllReviews() {
    const res = await axios.delete(`${this.pintAccountantUrl}/api/reviews`);
    return res.data;
  },

  async deleteReview(id) {
    const res = await axios.delete(`${this.pintAccountantUrl}/api/reviews/${id}`);
    return res.data;
  },

  async createPlace(place) {
    const res = await axios.post(`${this.pintAccountantUrl}/api/places`, place);
    return res.data;
  },

  async getPlace(id) {
    const res = await axios.get(`${this.pintAccountantUrl}/api/places/${id}`);
    return res.data;
  },

  async getAllPlaces() {
    const res = await axios.get(`${this.pintAccountantUrl}/api/places`);
    return res.data;
  },

  async deleteAllPlaces() {
    const res = await axios.delete(`${this.pintAccountantUrl}/api/places`);
    return res.data;
  },
};
