<template>
  <div class="page">
    <div class="bg-orb orb-a"></div>
    <div class="bg-orb orb-b"></div>

    <div class="card">
      <p class="eyebrow">Employee System</p>
      <h2 class="title">สมัครสมาชิก</h2>
      <p class="subtitle">สร้างบัญชีเพื่อเข้าใช้งานระบบ</p>

      <form class="form register-form" @submit.prevent="submit">
        <div class="field">
          <label>ชื่อผู้ใช้</label>
          <input
            v-model="form.name"
            placeholder="เช่น somchai"
            required
          />
        </div>

        <div class="field">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="field">
          <label>รหัสผ่าน</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            required
          />
        </div>

        <div class="field">
          <label>ยืนยันรหัสผ่าน</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            required
          />
        </div>

        <button class="primary" type="submit" :disabled="loading">
          {{ loading ? "⏳ กำลังสมัคร..." : "สมัครสมาชิก" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>

        <p class="login-link">
          มีบัญชีอยู่แล้ว?
          <RouterLink to="/login">เข้าสู่ระบบ</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/services/auth.service";
import { toast } from "vue-sonner";

const router = useRouter();

const loading = ref(false);
const error = ref("");

const form = reactive({
  name: "",          
  email: "",
  password: "",
  confirmPassword: ""
});

const submit = async () => {
  error.value = "";

  if (!form.name || !form.email || !form.password) {
    error.value = "กรุณากรอกข้อมูลให้ครบ";
    return;
  }

  if (form.password !== form.confirmPassword) {
    error.value = "รหัสผ่านไม่ตรงกัน";
    return;
  }

  try {
    loading.value = true;

    await register({
      name: form.name,
      email: form.email,
      password: form.password
    });

    toast.success("สมัครสมาชิกสำเร็จ");
    router.push("/login");
  } catch (err: any) {
    console.error(err);
    error.value = "สมัครสมาชิกไม่สำเร็จ (Email อาจซ้ำ)";
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.page {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 15% 20%, rgba(20, 184, 166, 0.22), transparent 36%),
    radial-gradient(circle at 85% 80%, rgba(245, 158, 11, 0.22), transparent 42%),
    linear-gradient(160deg, #f8fafc, #e2e8f0);
}

.bg-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(8px);
  z-index: 0;
}

.orb-a {
  width: 280px;
  height: 280px;
  top: -80px;
  right: -60px;
  background: rgba(20, 184, 166, 0.24);
}

.orb-b {
  width: 320px;
  height: 320px;
  left: -100px;
  bottom: -100px;
  background: rgba(245, 158, 11, 0.2);
}

.card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  padding: 34px 30px 28px;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.14);
}

.eyebrow {
  display: inline-block;
  margin: 0 auto 14px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ecfeff;
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.title {
  text-align: center;
  margin: 0;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.1;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  color: #475569;
  margin-bottom: 22px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.register-form {
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #334155;
  font-weight: 500;
}

.field input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.16);
}

button.primary {
  margin-top: 10px;
  padding: 11px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #0ea5a3, #0f766e);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

button.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 118, 110, 0.28);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  margin-top: 6px;
  text-align: center;
  color: #dc2626;
  font-size: 13px;
}

.login-link {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.login-link a {
  color: #0f766e;
  text-decoration: none;
  font-weight: 700;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 520px) {
  .card {
    padding: 26px 18px 22px;
    border-radius: 16px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
