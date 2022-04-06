import axios from "axios";

const API_URL = "https://ticket-backend-butt.herokuapp.com";

const instance = axios.create({
  baseURL: API_URL,
});

export const newTicket = () => instance.post("/new");
export const weeklyTicket = () => instance.get("/weekly");
export const monthlyTicket = () => instance.get("/monthly");
