import api from "./api";

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/register", data);
};

export const login = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/login", data);
};

export const resetPassword = (data: {
  email: string;
  newPassword: string;
}) => {
  return api.post("/auth/reset-password", data);
};

