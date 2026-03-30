import api from "./api";

export type User = {
  id: number;
  email: string;
  role: "admin" | "user";
};
/* ================= USERS ================= */

// ดึง users ทั้งหมด (admin only)
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/admin/users");
  return res.data;
};

// เปลี่ยน role ผู้ใช้
export const updateUserRole = async (
  id: number,
  role: "admin" | "user"
) => {
  try {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  } catch (err) {
    console.error("updateUserRole failed", err);
    throw err;
  }
};

// ลบ user
export const deleteUser = async (id: number) => {
  await api.delete(`/admin/users/${id}`);
};
