<template>
  <form class="form" @submit.prevent="onSubmit">
    <div class="field">
      <label>ชื่อ</label>
      <input v-model="localForm.first_name" />
      <small v-if="errors.first_name" class="error">
        {{ errors.first_name }}
      </small>
    </div>

    <div class="field">
      <label>นามสกุล</label>
      <input v-model="localForm.last_name" />
      <small v-if="errors.last_name" class="error">
        {{ errors.last_name }}
      </small>
    </div>

    <div class="field">
      <label>แผนก</label>
      <input v-model="localForm.department" />
    </div>

    <div class="field">
      <label>ตำแหน่ง</label>
      <input v-model="localForm.position" />
    </div>

    <div class="actions">
      <button type="submit" :disabled="saving">
        {{ saving ? "⏳ กำลังบันทึก..." : submitLabel }}
      </button>

      <button type="button" @click="$emit('cancel')">
        ยกเลิก
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps<{
  modelValue: {
    first_name: string;
    last_name: string;
    department: string;
    position: string;
  };
  saving: boolean;
  error: string;
  submitLabel: string;
}>();

const emit = defineEmits<{
  (e: "submit", payload: typeof props.modelValue): void;
  (e: "cancel"): void;
}>();

/* clone ข้อมูลออกมาใช้ */
const localForm = reactive({ ...props.modelValue });

/* sync เมื่อ parent เปลี่ยน */
watch(
  () => props.modelValue,
  (val) => Object.assign(localForm, val),
  { deep: true }
);

const onSubmit = () => {
  if (!validate()) return;

  emit("submit", { ...localForm });
};


const errors = reactive({
  first_name: "",
  last_name: ""
});

const validate = () => {
  errors.first_name = "";
  errors.last_name = "";

  if (!localForm.first_name.trim()) {
    errors.first_name = "กรุณากรอกชื่อ";
  } else if (localForm.first_name.trim().length < 2) {
    errors.first_name = "ชื่อต้องอย่างน้อย 2 ตัวอักษร";
  }

  if (!localForm.last_name.trim()) {
    errors.last_name = "กรุณากรอกนามสกุล";
  } else if (localForm.last_name.trim().length < 2) {
    errors.last_name = "นามสกุลต้องอย่างน้อย 2 ตัวอักษร";
  }

  return !errors.first_name && !errors.last_name;
};

</script>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
}

.card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  margin-bottom: 24px;
  color: #1f2937;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #374151;
}

.field input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  flex: 1;
}

button.primary {
  background: #22c55e;
  color: white;
}

button.secondary {
  background: #e5e7eb;
}

.error {
  margin-top: 10px;
  color: #dc2626;
  text-align: center;
}
/* พื้นหลังทั้งหน้า */
.page {
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #f8fafc, #eef2f7);
}

/* การ์ดฟอร์ม */
.form-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 18px;
  padding: 32px 34px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
}

/* ฟอร์ม */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* field */
.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
}

.field input {
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.field input::placeholder {
  color: #9ca3af;
}

.field input:focus {
  outline: none;
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

/* ปุ่ม */
.actions {
  display: flex;
  gap: 14px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* ปุ่มหลัก */
.btn.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.35);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(34, 197, 94, 0.45);
}

/* ปุ่มรอง */
.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn.secondary:hover {
  background: #e5e7eb;
}

/* disabled */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* error */
.error {
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
  text-align: center;
}
small.error {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}
</style>
