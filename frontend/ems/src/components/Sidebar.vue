<template>
  <aside class="sidebar">
    <router-link to="/dashboard">📊 Dashboard</router-link>
    <router-link to="/employees">👥 พนักงาน</router-link>
        <!-- 👑 ADMIN ONLY -->
    <router-link
      v-if="isAdmin"
      to="/admin/users"
    >
      👑 Admin Users
    </router-link>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getUserFromToken } from "@/utils/auth";

const user = getUserFromToken();

const isAdmin = computed(() => user?.role === "admin");
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #111827;
  color: white;
  padding: 20px;
  min-height: calc(100vh - 60px);
}

a {
  display: block;
  color: #d1d5db;
  text-decoration: none;
  margin-bottom: 12px;
}

a.router-link-active {
  color: white;
  font-weight: bold;
}
</style>
