import api from "./axios";
import type { HomeContent, Stat } from "../types";

export const getHomeContent = async (): Promise<HomeContent> => {
  const res = await api.get("/api/v1/home-content/active");
  return res.data;
};

export const getStats = async (): Promise<Stat[]> => {
  const res = await api.get("/api/v1/home-stats");
  return res.data;
};