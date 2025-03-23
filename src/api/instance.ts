import axios from "axios";
import { io } from "socket.io-client";

export const instance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://vanhanh-backend-production.up.railway.app/",

  timeout: 10000,
});

export const socket = io("http://localhost:6969/social");
