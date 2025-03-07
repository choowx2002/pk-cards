<script setup>
import { ref } from 'vue';

const message = ref('Welcome to My Vue 3 App!');
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100">
    <h1 class="text-4xl font-bold text-blue-600">{{ message }}</h1>
    <p class="mt-4 text-lg text-gray-700">This is a simple home page.</p>
    <router-link to="/list"><b>LIST</b></router-link>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>