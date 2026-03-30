<template>
  <div class="page">
    <p v-if="loading">กำลังโหลดข้อมูล...</p>

    <EmployeeForm
      v-if="!loading"
      v-model="form"
      :saving="saving"
      :error="error"
      submit-label="💾 บันทึก"
      @submit="update"
      @cancel="back"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import EmployeeForm from "@/components/EmployeeForm.vue";
import { getEmployeeById, updateEmployee } from "@/services/employee.service";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const error = ref("");

const form = reactive({
  first_name: "",
  last_name: "",
  department: "",
  position: ""
});

onMounted(async () => {
  try {
    loading.value = true;
    const id = Number(route.params.id);
    const data = await getEmployeeById(id);
    Object.assign(form, data);
  } catch (err) {
    error.value = "โหลดข้อมูลไม่สำเร็จ";
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
});

const update = async (data: typeof form) => {
  error.value = "";
  saving.value = true;

  try {
    const id = Number(route.params.id);
    await updateEmployee(id, data);

    toast.success("บันทึกข้อมูลสำเร็จ");
    router.push("/employees");
  } catch (err) {
    console.error(err);
    error.value = "บันทึกข้อมูลไม่สำเร็จ";
    toast.error(error.value);
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
