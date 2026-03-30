<template v-else>
  <div class="dashboard">

    <!-- ===== HEADER ===== -->
    <div class="dashboard-header">
      <h1 class="page-title">Dashboard</h1>
      <div class="actions">
        <button class="btn excel" @click="exportExcel">📥 Export Excel</button>
        <button class="btn pdf" @click="exportPDF">🧾 Export PDF</button>
      </div>
    </div>

    <!-- ===== STATS ===== -->
    <div class="stats">
      <div class="stat-card clickable" @click="goEmployees">
        <div class="icon blue">👥</div>
        <div class="info">
          <p class="label">พนักงานทั้งหมด</p>
          <p class="value">{{ totalEmployees }} คน</p>
        </div>
      </div>

      <div v-if="isAdmin" class="stat-card">
        <div class="icon green">🏢</div>
        <div class="info">
          <p class="label">จำนวนแผนก</p>
          <p class="value">{{ departmentCount }}</p>
        </div>
      </div>

      <div v-if="isAdmin" class="stat-card">
        <div class="icon purple">🆕</div>
        <div class="info">
          <p class="label">เพิ่มล่าสุด</p>
          <p class="value">{{ latestAddedText }}</p>
        </div>
      </div>
    </div>

    <!-- ===== CHARTS ===== -->
    <div v-if="isAdmin" class="grid-2">
      <div class="card">
        <h2>สัดส่วนพนักงาน</h2>
        <DepartmentDoughnut :departments="departments" />
      </div>

      <div class="card">
        <h2>พนักงานแยกตามแผนก</h2>
        <DepartmentChart :departments="departments" />
      </div>
    </div>

    <!-- ===== RECENT ===== -->
    <div v-if="isAdmin" class="card">
      <h2>พนักงานล่าสุด</h2>
      <ul class="recent">
        <li v-for="e in recentEmployees" :key="e.id">
          <span class="name">{{ e.first_name }} {{ e.last_name }}</span>
          <span class="dept">{{ e.department }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getEmployeeStats, exportEmployeesExcel, exportEmployeesPDF} from "@/services/employee.service";
import { getUserFromToken } from "@/utils/auth";
import DepartmentChart from "@/components/DepartmentChart.vue";
import DepartmentDoughnut from "@/components/DepartmentDoughnut.vue";

type DepartmentStat = {
  department: string;
  count: number;
};

const router = useRouter();

const totalEmployees = ref(0);
const departments = ref<DepartmentStat[]>([]);
const departmentCount = ref(0);
const recentEmployees = ref<any[]>([]);
const latestAddedText = ref("-");

const user = getUserFromToken();
const isAdmin = computed(() => user?.role === "admin");

onMounted(async () => {
  const data = await getEmployeeStats();

  totalEmployees.value = data?.total ?? 0;
  recentEmployees.value = data?.recent ?? [];
  latestAddedText.value = formatLatestAdded(recentEmployees.value[0]?.created_at);

  const map: Record<string, number> = {};
  (data?.byDepartment ?? []).forEach((d: any) => {
    const key = d.department?.toUpperCase();
    if (!key) return;
    map[key] = (map[key] || 0) + Number(d.count);
  });

  departments.value = Object.entries(map).map(([department, count]) => ({
    department,
    count,
  }));

  departmentCount.value = departments.value.length;
});

const formatLatestAdded = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const goEmployees = () => router.push("/employees");
const exportExcel = () => exportEmployeesExcel();
const exportPDF = () => exportEmployeesPDF();

</script>

<style scoped>
.dashboard {
  padding: 30px;
  background: #f8fafc;
  min-height: 100vh;
}

/* ===== HEADER ===== */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: 26px;
  color: #1f2937;
}

/* ===== BUTTONS ===== */
.actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: white;
  transition: 0.15s;
}

.btn.excel { background: #10b981; }
.btn.excel:hover { background: #059669; }

.btn.pdf { background: #ef4444; }
.btn.pdf:hover { background: #dc2626; }

/* ===== STATS ===== */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.stat-card.clickable {
  cursor: pointer;
  border: 2px solid transparent;
}

.stat-card.clickable:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
}

/* ===== ICON ===== */
.icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.icon.blue { background: #e0e7ff; color: #4338ca; }
.icon.green { background: #dcfce7; color: #15803d; }
.icon.purple { background: #f3e8ff; color: #7e22ce; }

.info .label {
  font-size: 14px;
  color: #6b7280;
}

.info .value {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
}

/* ===== GRID ===== */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

/* ===== CARD ===== */
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.card h2 {
  margin-bottom: 16px;
  color: #1f2937;
}

/* ===== RECENT ===== */
.recent {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}

.recent .name {
  font-weight: 500;
}

.recent .dept {
  font-size: 13px;
  color: #6b7280;
}

</style>
