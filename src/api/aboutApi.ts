import api from "./axios";
import type { AboutContent, Member, Value, Partner } from "../types";

export const getAboutContent = async (): Promise<AboutContent> => {
  const res = await api.get("/api/v1/about-content/active");
  return res.data;
};

export const getMembers = async (): Promise<Member[]> => {
  const res = await api.get("/api/v1/members");
  return res.data;
};

export const getValues = async (): Promise<Value[]> => {
  const res = await api.get("/api/v1/values");
  return res.data;
};

export const getPartners = async (): Promise<Partner[]> => {
  const res = await api.get("/api/v1/partners");
  return res.data;
};