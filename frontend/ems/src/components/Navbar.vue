<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getUserFromToken, logout } from "@/utils/auth";

const router = useRouter();

const user = computed(() => getUserFromToken());

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

<template>
  <nav class="navbar">
    <div class="left">Employee System</div>

    <div class="right" v-if="user">
      <span class="user">
        {{ user.name || user.email }}
      </span>

      <button class="logout" @click="handleLogout">
        ออกจากระบบ
      </button>
    </div>
  </nav>
</template>


<style scoped>
.navbar {
  height: 64px;
  background: #1f2937;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.user {
  margin-right: 16px;
  font-weight: 500;
}

.logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.logout:hover {
  background: #dc2626;
}
</style>
