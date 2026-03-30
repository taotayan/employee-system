<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <h2>รายชื่อพนักงาน</h2>
      <button
          v-if="isAdmin"
          class="add-btn"
          @click="goAdd"
        >
          ➕ เพิ่มพนักงาน
      </button>
    </div>

    <!-- Search -->
    <div class="search-box">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาชื่อ / นามสกุล / แผนก / ตำแหน่ง"
      />
    </div>

    <!-- Count -->
    <p class="count">
      แสดง {{ filteredEmployees.length }} รายการ
    </p>

    <!-- Loading / Error -->
    <p v-if="loading" class="loading">กำลังโหลดข้อมูล...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <EmployeeTable
      v-if="!loading && paginatedEmployees.length"
      :employees="paginatedEmployees"
      :is-admin="isAdmin"
      @edit="edit"
      @delete="remove"
    />
    <!-- Empty -->
    <p
      v-else-if="!loading && !paginatedEmployees.length"
      class="empty"
    >
      ไม่พบข้อมูลพนักงาน
    </p>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        ⬅ ก่อนหน้า
      </button>

      <span>หน้า {{ currentPage }} / {{ totalPages }}</span>

      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        ถัดไป ➡
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import EmployeeTable from "@/components/EmployeeTable.vue";
import { getEmployees, deleteEmployee } from "@/services/employee.service";
import { getUserFromToken } from "@/utils/auth";

/* state */
const router = useRouter();
const employees = ref<any[]>([]);
const search = ref("");
const loading = ref(false);
const error = ref("");
const user = getUserFromToken();
const isAdmin = computed(() => user?.role === "admin");

/* pagination */
const currentPage = ref(1);
const pageSize = 5;

/* search filter */
const filteredEmployees = computed(() => {
  if (!search.value.trim()) return employees.value;

  const q = search.value.toLowerCase();
  return employees.value.filter(emp =>
    `${emp.first_name} ${emp.last_name} ${emp.department} ${emp.position}`
      .toLowerCase()
      .includes(q)
  );
});

/* pagination logic */
const totalPages = computed(() =>
  Math.ceil(filteredEmployees.value.length / pageSize)
);

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredEmployees.value.slice(start, end);
});

/* reset page when search changes */
watch(search, () => {
  currentPage.value = 1;
});

/* fetch data */
onMounted(async () => {
  try {
    loading.value = true;
    employees.value = await getEmployees();
  } catch {
    error.value = "โหลดข้อมูลไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
});

/* actions */
const goAdd = () => {
  router.push("/employees/create");
};

const edit = (id: number) => {
  if (!isAdmin.value) return;
  router.push(`/employees/${id}/edit`);
};

const remove = async (id: number) => {
  if (!isAdmin.value) return;

  if (!confirm("ยืนยันการลบ?")) return;

  try {
    await deleteEmployee(id);
    employees.value = employees.value.filter(e => e.id !== id);

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }
  } catch {
    alert("ลบข้อมูลไม่สำเร็จ");
  }
};
</script>

<style scoped>
.page {
  padding: 30px;
  background: #f8fafc;
  min-height: 100vh;
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #1f2937;
}

.add-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.add-btn:hover {
  background: #16a34a;
}

/* search */
.search-box {
  margin-bottom: 10px;
}

.search-box input {
  width: 100%;
  max-width: 320px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

/* count */
.count {
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 14px;
}

/* states */
.loading {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.error {
  color: red;
  margin-top: 10px;
}

.empty {
  margin-top: 20px;
  text-align: center;
  color: #6b7280;
}

/* pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.pagination button {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #e5e7eb;
}

.pagination button:hover:not(:disabled) {
  background: #d1d5db;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
