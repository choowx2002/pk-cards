import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CardView from "@/views/CardView.vue";
import CardList from "@/views/CardList.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/list",
        name: "CardList",
        component: CardList,
    },
    {
        path: "/card",
        component: CardView
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
