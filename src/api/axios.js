// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ========== TOKEN ATTACH INTERCEPTOR ==========
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH APIS ==========

// Login
export const loginUser = async (email, password) => {
  const res = await API.post("/user/login", { email, password });
  return res.data;
};

// Signup
export const signupUser = async (userData) => {
  const res = await API.post("/user/register", userData);
  return res.data;
};

// Get Logged In Profile
export const getProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
};

// Example: Fetch all users
export const fetchUsers = async () => {
  const res = await API.get("/user/all");
  return res.data;
};

// Example: Update user
export const updateUser = async (id, userData) => {
  const res = await API.put(`/user/update/${id}`, userData);
  return res.data;
};

// Example: Delete user
export const deleteUser = async (id) => {
  const res = await API.delete(`/user/delete/${id}`);
  return res.data;
};

export default API;
