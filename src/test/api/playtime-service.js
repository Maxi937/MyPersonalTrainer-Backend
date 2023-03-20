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

  async createPlaylist(playlist) {
    const res = await axios.post(`${this.pintAccountantUrl}/api/playlists`, playlist);
    return res.data;
  },

  async deleteAllPlaylists() {
    const response = await axios.delete(`${this.pintAccountantUrl}/api/playlists`);
    return response.data;
  },

  async deletePlaylist(id) {
    const response = await axios.delete(`${this.pintAccountantUrl}/api/playlists/${id}`);
    return response;
  },

  async getAllPlaylists() {
    const res = await axios.get(`${this.pintAccountantUrl}/api/playlists`);
    return res.data;
  },

  async getPlaylist(id) {
    const res = await axios.get(`${this.pintAccountantUrl}/api/playlists/${id}`);
    return res.data;
  },

  async getAllTracks() {
    const res = await axios.get(`${this.pintAccountantUrl}/api/tracks`);
    return res.data;
  },

  async createTrack(id, track) {
    const res = await axios.post(`${this.pintAccountantUrl}/api/playlists/${id}/tracks`, track);
    return res.data;
  },

  async deleteAllTracks() {
    const res = await axios.delete(`${this.pintAccountantUrl}/api/tracks`);
    return res.data;
  },

  async getTrack(id) {
    const res = await axios.get(`${this.pintAccountantUrl}/api/tracks/${id}`);
    return res.data;
  },

  async deleteTrack(id) {
    const res = await axios.delete(`${this.pintAccountantUrl}/api/tracks/${id}`);
    return res.data;
  },
};
