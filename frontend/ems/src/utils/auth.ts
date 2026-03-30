import { jwtDecode } from "jwt-decode";

export type UserPayload = {
  id: number;
  email: string;
  name?: string;
  role: "admin" | "user";
  exp: number;
};

/* ================= TOKEN ================= */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/* ================= DECODE USER ================= */
export const getUserFromToken = (): UserPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<UserPayload>(token);
  } catch {
    return null;
  }
};

/* ================= CHECK EXPIRE ================= */
export const isTokenExpired = (): boolean => {
  const user = getUserFromToken();
  if (!user?.exp) return true;

  const now = Date.now() / 1000; // seconds
  return user.exp < now;
};

/* ================= AUTH ================= */
export const isAuth = (): boolean => {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired()) {
    logout();
    return false;
  }

  return true;
};

/* ================= LOGOUT ================= */
export const logout = (): void => {
  localStorage.removeItem("token");
};
