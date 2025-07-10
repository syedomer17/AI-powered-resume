// ai-resume-app/service/GlobalApi.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createNewResume = (data: {
  title: string;
  userEmail: string;
  userName: string;
}) => axiosClient.post("/resumes", data);

export const getAllResumes = () => axiosClient.get("/resumes");

export const getResumeById = (id: string) => axiosClient.get(`/resumes/${id}`);

export const updateResume = (
  id: string,
  data: { title?: string; content?: string }
) => axiosClient.put(`/resumes/${id}`, data);

export const deleteResume = (id: string) => axiosClient.delete(`/resumes/${id}`);

export const createPersonalDetails = (data: {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
}) => axiosClient.post("/personal-details", data);

export const createSummary = (data: { summary: string }) =>
  axiosClient.post("/summaries", data);
