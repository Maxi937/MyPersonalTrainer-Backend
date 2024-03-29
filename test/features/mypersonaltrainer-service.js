import axios from "axios";
import { serviceUrl } from "../fixtures/fixtures.js";
import logger from "../../src/utility/logger.js";
import { registerAxiosResponseHandler } from "../test-utils.js";

registerAxiosResponseHandler(axios);
logger.info(`Service Url: ${serviceUrl}`);

export const myPersonalTrainerService = {
  url: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.url}/api/users`, user);
    return res.data;
  },

  async createTrainer(trainer) {
    const res = await axios.post(`${this.url}/api/trainers`, trainer);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.url}/api/users/${id}`);
    return res.data;
  },

  async deleteUser(id) {
    const res = await axios.delete(`${this.url}/api/users/${id}`);
    return res.data;
  },

  async getUsers(args = {}) {
    let queryString = "?";
    Object.entries(args).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    const res = await axios.get(`${this.url}/api/users${queryString}`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.url}/api/users`);
    return res.data;
  },

  async getTrainers(args = {}) {
    let queryString = "?";
    Object.entries(args).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    const res = await axios.get(`${this.url}/api/trainers${queryString}`);
    return res.data;
  },

  async getAllTrainers() {
    const res = await axios.get(`${this.url}/api/trainers`);
    return res.data;
  },

  async deleteTrainer(id) {
    const res = await axios.delete(`${this.url}/api/trainers/${id}`);
    return res.data;
  },

  async deleteAllTrainers() {
    const res = await axios.delete(`${this.url}/api/trainers`);
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

  async addClientToTrainer(trainerId, clientId) {
    const res = await axios.post(`${this.url}/api/trainers/clients`, { trainerId: trainerId, clientId: clientId });
    return res.data;
  },

  async deleteClient(trainerId, clientId) {
    const res = await axios.delete(`${this.url}/api/trainers/${trainerId}/clients/${clientId}`);
    return res.data;
  },

  async createExercise(exercise) {
    const res = await axios.post(`${this.url}/api/exercises`, exercise);
    return res.data;
  },

  async getExercises(args = {}) {
    let queryString = "?";
    Object.entries(args).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    const res = await axios.get(`${this.url}/api/exercises${queryString}`);
    return res.data;
  },

  async deleteExercise(id) {
    const res = await axios.delete(`${this.url}/api/exercises/${id}`);
    return res.data;
  },

  async deleteAllExercises() {
    const res = await axios.delete(`${this.url}/api/exercises`);
    return res.data;
  },

  async createWorkout(workout) {
    const res = await axios.post(`${this.url}/api/workouts`, workout);
    return res.data;
  },

  async getWorkouts(args = {}) {
    let queryString = "?";
    Object.entries(args).forEach(([key, value]) => {
      queryString += `${key}=${value}&`;
    });

    const res = await axios.get(`${this.url}/api/workouts${queryString}`);
    return res.data;
  },

  async deleteWorkout(id) {
    const res = await axios.delete(`${this.url}/api/workouts/${id}`);
    return res.data;
  },

  async deleteAllWorkouts() {
    const res = await axios.delete(`${this.url}/api/workouts`);
    return res.data;
  },

  async getProfile() {
    const res = await axios.get(`${this.url}/api/profile`);
    return res.data;
  },
};
