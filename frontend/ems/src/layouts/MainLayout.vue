<template>
  <div>
    <Navbar />
    <div class="layout">
      <Sidebar />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<style scoped>
.layout {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
}
</style>
