import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL.toString();

const instance = axios.create({
  baseURL: API_URL,
});

export const newTicket = () => instance.post("/new");
export const weeklyTicket = () => instance.get("/weekly");
export const monthlyTicket = () => instance.get("/monthly");
