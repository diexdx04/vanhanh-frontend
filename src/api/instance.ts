import axios from "axios";
import { io } from "socket.io-client";

export const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const socket = io("http://localhost:6969/social");
