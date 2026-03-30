<template>
  <div class="login-wrapper">
    <div class="bg-orb orb-a"></div>
    <div class="bg-orb orb-b"></div>

    <div class="login-card">
      <p class="eyebrow">Employee System</p>
      <h2>เข้าสู่ระบบ</h2>
      <p class="subtitle">ยินดีต้อนรับกลับ กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ</p>

      <form @submit.prevent="login" class="login-form">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button type="submit" class="primary-btn">Login</button>
        <button type="button" class="forgot-btn" @click="openForgotModal">
          ลืมรหัสผ่าน?
        </button>
        <p class="register-link">
    ยังไม่มีบัญชี?
    <span @click="goRegister">สมัครสมาชิก</span>
  </p>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>

    <div v-if="showForgotModal" class="modal-overlay" @click.self="closeForgotModal">
      <div class="modal-card">
        <h3>เปลี่ยนรหัสผ่าน</h3>
        <p class="modal-subtitle">กรอกอีเมลและรหัสผ่านใหม่</p>

        <form @submit.prevent="submitResetPassword">
          <input
            v-model="forgotEmail"
            type="email"
            placeholder="Email"
          />
          <input
            v-model="newPassword"
            type="password"
            placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)"
          />
          <input
            v-model="confirmNewPassword"
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
          />

          <p v-if="forgotError" class="error">{{ forgotError }}</p>
          <p v-if="forgotSuccess" class="success">{{ forgotSuccess }}</p>

          <div class="modal-actions">
            <button type="button" class="secondary-btn" @click="closeForgotModal">
              ยกเลิก
            </button>
            <button type="submit" class="primary-btn">บันทึกรหัสผ่านใหม่</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login as loginApi, resetPassword } from "@/services/auth.service";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const showForgotModal = ref(false);
const forgotEmail = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const forgotError = ref("");
const forgotSuccess = ref("");

const login = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "กรุณากรอกข้อมูลให้ครบ";
    return;
  }

  try {
    const res = await loginApi({
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);

    // ไปหน้า dashboard หรือ employees
    router.push("/dashboard");
  } catch (err: any) {
    error.value = err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ";
  }
};
const goRegister = () => {
  router.push("/register");
};

const openForgotModal = () => {
  showForgotModal.value = true;
  forgotEmail.value = email.value;
  forgotError.value = "";
  forgotSuccess.value = "";
};

const closeForgotModal = () => {
  showForgotModal.value = false;
  forgotError.value = "";
  forgotSuccess.value = "";
  newPassword.value = "";
  confirmNewPassword.value = "";
};

const submitResetPassword = async () => {
  forgotError.value = "";
  forgotSuccess.value = "";

  if (!forgotEmail.value || !newPassword.value || !confirmNewPassword.value) {
    forgotError.value = "กรุณากรอกข้อมูลให้ครบ";
    return;
  }

  if (newPassword.value.length < 6) {
    forgotError.value = "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร";
    return;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    forgotError.value = "รหัสผ่านใหม่ไม่ตรงกัน";
    return;
  }

  try {
    await resetPassword({
      email: forgotEmail.value,
      newPassword: newPassword.value,
    });

    forgotSuccess.value = "เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่";
    password.value = "";
  } catch (err: any) {
    forgotError.value = err.response?.data?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ";
  }
};
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.login-wrapper {
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

.login-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  padding: 34px 30px 28px;
  width: 100%;
  max-width: 420px;
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

.login-card h2 {
  text-align: center;
  margin: 0;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.1;
}

.subtitle {
  margin: 10px 0 22px;
  text-align: center;
  color: #475569;
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-card input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login-card input:focus,
.modal-card input:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.16);
}

.primary-btn {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #0ea5a3, #0f766e);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 118, 110, 0.28);
}

.forgot-btn {
  border: none;
  background: transparent;
  color: #0f766e;
  font-size: 13px;
  justify-self: end;
  cursor: pointer;
  padding: 2px 0;
}

.forgot-btn:hover {
  text-decoration: underline;
}

.error {
  margin-top: 6px;
  text-align: center;
  color: #dc2626;
  font-size: 13px;
}

.register-link {
  margin-top: 6px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.register-link span {
  color: #0f766e;
  cursor: pointer;
  font-weight: 700;
}

.register-link span:hover {
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-card {
  width: 100%;
  max-width: 450px;
  background: #fff;
  border-radius: 18px;
  padding: 24px 22px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.22);
}

.modal-card h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
}

.modal-subtitle {
  margin: 8px 0 16px;
  color: #64748b;
  font-size: 14px;
}

.modal-card input {
  width: 100%;
  padding: 11px 13px;
  margin-bottom: 12px;
  border-radius: 11px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
}

.modal-actions {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 10px;
}

.secondary-btn {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #334155;
  font-size: 14px;
  cursor: pointer;
}

.secondary-btn:hover {
  background: #e2e8f0;
}

.success {
  margin-top: 6px;
  text-align: center;
  color: #059669;
  font-size: 13px;
}

@media (max-width: 520px) {
  .login-card {
    padding: 26px 18px 22px;
    border-radius: 16px;
  }

  .login-card h2 {
    font-size: 24px;
  }

  .modal-card {
    padding: 20px 16px;
  }

  .modal-actions {
    grid-template-columns: 1fr;
  }
}

</style>
