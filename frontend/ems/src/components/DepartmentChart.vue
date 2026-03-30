<template>
  <div class="chart-card">
    <h2 class="chart-title">พนักงานแยกตามแผนก</h2>

    <div class="chart-wrapper">
      <Bar :data="chartData" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type DepartmentStat = {
  department: string;
  count: number;
};

const props = defineProps<{
  departments: DepartmentStat[];
}>();

/* 🎨 สีแท่ง (วนอัตโนมัติ) */
const colors = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#14b8a6", // teal
];

/* ✅ reactive chart data */
const chartData = computed(() => ({
  labels: props.departments.map(d => d.department),
  datasets: [
    {
      label: "จำนวนพนักงาน",
      data: props.departments.map(d => d.count),
      backgroundColor: props.departments.map(
        (_, i) => colors[i % colors.length]
      ),
      borderRadius: 8,
      maxBarThickness: 60,
    },
  ],
}));

/* ✅ options */
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.raw} คน`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
      grid: {
        color: "#e5e7eb",
      },
    },
    x: {
      grid: {
        display: false,
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
  height: 280px; /* 🔥 สำคัญ: ถ้าไม่มี กราฟไม่ขึ้น */
}
</style>
