<template>
  <div class="page">

    <EmployeeForm
      :model-value="form"
      :saving="saving"
      :error="error"
      submit-label="➕ เพิ่มพนักงาน"
      @submit="create"
      @cancel="back"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import EmployeeForm from "@/components/EmployeeForm.vue";
import { createEmployee } from "@/services/employee.service";

const router = useRouter();

const saving = ref(false);
const error = ref("");

const form = reactive({
  first_name: "",
  last_name: "",
  department: "",
  position: ""
});

const create = async (data: typeof form) => {
  error.value = "";
  saving.value = true;

  try {
    await createEmployee(data);
    toast.success("เพิ่มพนักงานสำเร็จ");
    router.push("/employees");
  } catch {
    error.value = "เพิ่มพนักงานไม่สำเร็จ";
    toast.error("เพิ่มพนักงานไม่สำเร็จ");
  } finally {
    saving.value = false;
  }
};

const back = () => router.push("/employees");
</script>

<style scoped>
.page {
  max-width: 500px;
  margin: 40px auto;
  background: white;
  padding: 24px;
  border-radius: 12px;
}
</style>
