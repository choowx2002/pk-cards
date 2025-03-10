import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CardView from "@/views/CardView.vue";
import CardList from "@/views/CardList.vue";
import DeckBuilder from "@/views/DeckBuilder.vue"

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/list",
        name: "cardList",
        component: CardList,
    },
    {
        path: "/deckbuilder",
        name: "deckBuilder",
        component: DeckBuilder,
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
