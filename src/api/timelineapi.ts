import axios from "./axios";

export interface TimelineEvent {
  id: number;
  title: string;
  description?: string;
  category: TimelineCategory;
  date: string; // ISO date string
  result?: string;
  organization?: string;
  position?: string;
  prizeAmount?: number;
  link?: string;
  extraInfo?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type TimelineCategory =
  | "MILESTONE"
  | "COMPETITION"
  | "PUBLICATION"
  | "PATENT"
  | "FUNDING"
  | "RECOGNITION";

export interface TimelineDashboardStats {
  totalCompetitionsCount: number;
  totalCompetitionPrize: number;
  totalFunding: number;
}

export const timelineApi = {
  getAll: () =>
    axios.get<TimelineEvent[]>("/api/v1/timeline").then((r) => r.data),

  getByCategory: (category: TimelineCategory) =>
    axios
      .get<TimelineEvent[]>(`/api/v1/timeline/category/${category}`)
      .then((r) => r.data),

  getStats: () =>
    axios
      .get<TimelineDashboardStats>("/api/v1/timeline/stats")
      .then((r) => r.data),

  getById: (id: number) =>
    axios.get<TimelineEvent>(`/api/v1/timeline/${id}`).then((r) => r.data),

  create: (dto: Partial<TimelineEvent>) =>
    axios.post<TimelineEvent>("/api/v1/timeline", dto).then((r) => r.data),

  update: (id: number, dto: Partial<TimelineEvent>) =>
    axios.patch<TimelineEvent>(`/api/v1/timeline/${id}`, dto).then((r) => r.data),

  delete: (id: number) =>
    axios.delete(`/api/v1/timeline/${id}`).then((r) => r.data),
};