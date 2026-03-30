<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>แผนก</th>
          <th>ตำแหน่ง</th>
          <th v-if="isAdmin" class="center">จัดการ</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="emp in employees" :key="emp.id">
          <td>{{ emp.first_name }} {{ emp.last_name }}</td>
          <td>{{ emp.department }}</td>
          <td>{{ emp.position }}</td>

          <td v-if="isAdmin" class="center">
            <button
              class="edit"
              @click="$emit('edit', emp.id)"
            >
              ✏️
            </button>
            <button
              class="delete"
              @click="$emit('delete', emp.id)"
            >
              🗑
            </button>
          </td>
        </tr>

        <tr v-if="employees.length === 0">
          <td :colspan="isAdmin ? 4 : 3" class="empty">
            ไม่มีข้อมูลพนักงาน
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
}

defineProps<{
  employees: Employee[];
  isAdmin: boolean;
}>();

defineEmits<{
  (e: "edit", id: number): void;
  (e: "delete", id: number): void;
}>();
</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #e5e7eb;
}

th,
td {
  padding: 12px;
  text-align: left;
}

th {
  font-weight: 600;
  color: #374151;
}

tbody tr:hover {
  background: #f1f5f9;
}

.center {
  text-align: center;
}

button.edit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
}

button.delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}
</style>
