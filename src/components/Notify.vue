<script setup>
import { ref } from "vue";

const notifications = ref([]);

const addNotification = (message, type = "info", duration = 3000) => {
  const id = Date.now();
  notifications.value.push({ id, message, type });

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

defineExpose({ addNotification });
</script>

<template>
  <div class="fixed bottom-5 left-5 space-y-3 z-50">
    <div
      v-for="notif in notifications"
      :key="notif.id"
      class="p-3 rounded-lg shadow-lg text-white flex items-center gap-2 transition-transform duration-300 ease-in-out"
      :class="{
        'bg-green-500': notif.type === 'success',
        'bg-red-500': notif.type === 'error',
        'bg-yellow-500': notif.type === 'warning',
        'bg-blue-300': notif.type === 'info',
      }"
    >
      <span>{{ notif.message }}</span>
      <button @click="removeNotification(notif.id)" class="text-white font-bold">&times;</button>
    </div>
  </div>
</template>
