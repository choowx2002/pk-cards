<script setup>
import { ref } from "vue";
</script>
<template>
    <div
        class="min-h-screen flex flex-col justify-center items-center bg-teal-50"
    >
        <h1
            class="text-5xl font-extrabold animate-bounce  drop-shadow-lg"
        >
            哈基符！哈基符！哈基符！
        </h1>
        <router-link
            to="/list"
            class="mt-6 px-6 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg shadow-md transition hover:bg-teal-700 hover:shadow-lg active:scale-95"
        >
            LIST
        </router-link>
    </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
