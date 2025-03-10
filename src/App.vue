<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const haveHeader = () => {
    const haveHeaderPaths = ["cardList", "deckBuilder"];
    const routePathname = route.name;
    return haveHeaderPaths.includes(routePathname);
};
</script>

<template>
    <div class="h-[60px] py-2 px-4 bg-teal-700 flex items-center" v-if="haveHeader()">
        <router-link to="/" class="font-extrabold text-3xl text-white mr-4">哈基符！</router-link>
        <router-link
            to="/list"
            class="text-white px-4 hover:font-bold h-full flex items-center"
            :title="$t('LIST')"
            :class="{ 'animate-pulse font-bold': route.path === '/list' }"
        >
            {{ $t("LIST") }}
        </router-link>
        <router-link
            to="/deckbuilder"
            class="text-white px-4 hover:font-bold h-full flex items-center"
            :title="$t('DECKBUILDER')"
            :class="{ 'animate-pulse font-bold': route.path === '/deckbuilder' }"
        >
            {{ $t("DECKBUILDER") }}
        </router-link>
    </div>
    <router-view />
</template>

<style scoped></style>
