<template>
  <div class="chart-card">
    <h2 class="chart-title">สัดส่วนพนักงาน</h2>

    <div class="chart-wrapper" v-if="departments.length">
      <Doughnut :data="chartData" :options="options" />
    </div>

    <p v-else class="empty">ไม่มีข้อมูล</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type DepartmentStat = {
  department: string;
  count: number;
};

const props = defineProps<{
  departments: DepartmentStat[];
}>();

/* 🎨 สีกราฟ */
const colors = [
  "#60a5fa",
  "#34d399",
  "#f472b6",
  "#facc15",
  "#a78bfa",
  "#fb7185",
  "#38bdf8",
];

/* ✅ reactive data */
const chartData = computed(() => ({
  labels: props.departments.map(d => d.department),
  datasets: [
    {
      data: props.departments.map(d => d.count),
      backgroundColor: props.departments.map(
        (_, i) => colors[i % colors.length]
      ),
      borderWidth: 2,
      borderColor: "#ffffff",
      hoverOffset: 6,
    },
  ],
}));

/* ✅ typed options (สำคัญมาก) */
const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: {
    legend: {
      position: "bottom", // ✅ ไม่ error แล้ว
      labels: {
        boxWidth: 14,
        padding: 16,
        color: "#374151",
      },
    },
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.label}: ${ctx.raw} คน`,
      },
    },
  },
};
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.chart-title {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.chart-wrapper {
  height: 260px;
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
}
</style>
