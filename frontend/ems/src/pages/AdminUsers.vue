<template>
  <div class="page">
    <h2 class="title">👑 จัดการผู้ใช้งาน</h2>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th class="center">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td class="email">{{ u.email }}</td>

            <td>
              <select
                v-model="u.role"
                @change="changeRole(u)"
                :class="['role-select', u.role]"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </td>

            <td class="center">
              <button
                class="delete"
                @click="remove(u.id)"
                :disabled="u.id === currentUser?.id"
                title="ลบผู้ใช้งาน"
              >
                🗑
              </button>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="3" class="empty">
              ไม่มีผู้ใช้งาน
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import {getUsers, updateUserRole, deleteUser} from "@/services/user.service";
import { getUserFromToken } from "@/utils/auth";
import { toast } from "vue-sonner";

const users = ref<any[]>([]);
const currentUser = getUserFromToken();

onMounted(async () => {
  try {
    users.value = await getUsers();
  } catch (err) {
    toast.error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
  }
});

const changeRole = async (user: any) => {
  await updateUserRole(user.id, user.role);
  toast.success("เปลี่ยน role สำเร็จ");
};

const remove = async (id: number) => {
  if (!confirm("ลบผู้ใช้งานนี้?")) return;
  await deleteUser(id);
  users.value = users.value.filter(u => u.id !== id);
  toast.success("ลบผู้ใช้งานสำเร็จ");
};
</script>

<style scoped>
.page {
  padding: 30px;
  background: #f8fafc;
  min-height: 100vh;
}

.title {
  font-size: 22px;
  margin-bottom: 20px;
  color: #1f2937;
}

/* card */
.card {
  background: white;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

/* table */
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #e5e7eb;
}

th,
td {
  padding: 14px;
  text-align: left;
  font-size: 14px;
}

th {
  font-weight: 600;
  color: #374151;
}

tbody tr:hover {
  background: #f9fafb;
}

.center {
  text-align: center;
}

.email {
  font-weight: 500;
  color: #111827;
}

/* role select */
.role-select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  cursor: pointer;
}

.role-select.admin {
  background: #fef3c7;
  border-color: #f59e0b;
}

.role-select.user {
  background: #e0f2fe;
  border-color: #38bdf8;
}

/* delete button */
button.delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

button.delete:hover:not(:disabled) {
  background: #dc2626;
}

button.delete:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* empty */
.empty {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

</style>
