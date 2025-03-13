<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { runeColorsCss } from "/src/constant.js";
import {
    House,
    SquareArrowRight,
    SquareArrowLeft,
    Scroll,
} from "lucide-vue-next";
import replaceKeywords from "/src/helpers/keyMap.js";
import Notify from "/src/components/Notify.vue";
const base = import.meta.env.BASE_URL; 
const route = useRoute();
const router = useRouter();
const notifyRef = ref(null);
const cardId = computed(() => route.query.cardId || null);
const card = ref(null);
const prevCardRef = ref(null);
const nextCardRef = ref(null);

const fetchCardData = async (id) => {
    try {
        const response = await fetch(base + "/assets/data/cards-cn.json");
        const data = await response.json();
        if (!id) {
            const randomIndex = Math.floor(Math.random() * data.length);
            card.value = data[randomIndex];
        } else {
            const index = data.findIndex((c) => c.cardId === id);
            if (index !== -1) {
                card.value = data[index];
                prevCardRef.value = data[index - 1]?.cardId || null;
                nextCardRef.value = data[index + 1]?.cardId || null;
            } else {
                throw new Error("Card not found");
            }
        }
    } catch (error) {
        console.error("Failed to load card data:", error);
    }
};

onMounted(() => {
    fetchCardData(decodeURIComponent(cardId.value));
    window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
});

const checkRuneColor = (rune) => {
    return runeColorsCss[rune] || "black";
};

const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
        goToPrevPage();
    } else if (event.key === "ArrowRight") {
        goToNextPage();
    }
};

const goToPrevPage = () => {
    if (prevCardRef.value) {
        router.push({
            path: "/card",
            query: { cardId: encodeURIComponent(prevCardRef.value) },
        });
        fetchCardData(decodeURIComponent(cardId.value));
    } else {
        notifyRef.value?.addNotification(`最后一张了`, "info");
    }
};

const goToNextPage = () => {
    if (nextCardRef.value) {
        router.push({
            path: "/card",
            query: { cardId: encodeURIComponent(nextCardRef.value) },
        });
        fetchCardData(decodeURIComponent(cardId.value));
    } else {
        notifyRef.value?.addNotification(`最后一张了`, "info");
    }
};

watch(cardId, async (newId) => {
    await fetchCardData(decodeURIComponent(newId));
});

const backHomePage = () => {
    router.push("/");
};

const backListPage = () => {
    router.push("/list");
};
</script>

<template>
    <Notify ref="notifyRef" />
    <div v-if="card" class="w-screen h-screen flex justify-center items-center">
        <div
            class="px-4 py-1 grid grid-cols-3 gap-1 max-w-3xl max-[700px]:block"
        >
            <!-- 图片 -->
            <div class="col-span-1 my-auto">
                <img
                    v-if="card?.imgSrc"
                    :src="card.imgSrc"
                    :alt="card.name"
                    :class="{
                        'w-[250px]': true,
                        'aspect-[113/161.5]': card.type !== 'Battlefield',
                        'aspect-[161.5/113]': card.type === 'Battlefield',
                        'rounded-lg': true,
                        'min-w-[200px]': true,
                        'mx-auto': true,
                        'my-5': true,
                        'shadow-2xl': true, // 动态控制
                    }"
                />
            </div>

            <div
                class="col-span-2 m-2 ml-0 pl-2 text-center flex flex-wrap my-auto"
            >
                <!-- 卡片 ID -->
                <p class="text-center w-full text-sm text-gray-400">
                    ID: {{ card?.cardId }}
                </p>

                <!-- 卡片名称 -->
                <fieldset class="w-full rounded-lg border-2">
                    <legend
                        class="flex items-center justify-center mb-2 px-2 gap-1"
                    >
                        <h2 class="text-4xl font-bold">{{ card?.name }}</h2>
                        <img
                            :src="`${base}/assets/images/${card?.type?.toLowerCase()}.svg`"
                            :alt="card?.type"
                            width="32"
                        />
                    </legend>

                    <div v-if="card?.title || card?.champion" class="text-sm font-semibold italic">{{ card.title ?? card.champion }}</div>

                    <!-- 符文、能量、力量 -->
                    <div class="flex justify-center items-stretch gap-2">
                        <fieldset
                            v-if="card?.runeColor?.length"
                            class="rounded-lg border-2 px-4 py-1 flex gap-2 justify-center items-center"
                        >
                            <legend class="font-bold">
                                {{ $t("RUNE") }}
                            </legend>
                            <div
                                v-for="rune in card.runeColor"
                                :key="rune"
                                class="shadow-lg rounded-4xl overflow-hidden border-2"
                                :style="{
                                    background: runeColorsCss[rune] ?? 'black',
                                }"
                            >
                                <img
                                    :src="`${base}/assets/images/${rune.toUpperCase()}.webp`"
                                    width="32"
                                    :alt="rune"
                                    class="white-image"
                                />
                            </div>
                        </fieldset>

                        <fieldset
                            v-if="card?.cost?.energy !== undefined"
                            class="rounded-lg border-2 px-4 py-1 flex gap-2"
                        >
                            <legend class="font-bold">
                                {{ $t("ENERGY") }}
                            </legend>
                            <img
                                :src="`${base}/assets/images/energy-${card.cost.energy}.svg`"
                                width="36"
                                class="m-1 rounded-4xl drop-shadow-lg"
                                alt=""
                            />
                        </fieldset>

                        <fieldset
                            v-if="card?.cost?.power?.count"
                            class="rounded-lg border-2 px-4 py-1 flex gap-2"
                        >
                            <legend class="font-bold">
                                {{ $t("POWER") }}
                            </legend>
                            <div
                                class="shadow-lg rounded-4xl border-2 w-9 h-9 flex border-black justify-center items-center bg-black text-white font-extrabold m-1 text-2xl"
                                :style="{
                                    background: checkRuneColor(
                                        card.cost.power.rune
                                    ),
                                    fontFamily: 'BeaufortforLOLJa, sans-serif',
                                }"
                            >
                                {{ card.cost.power.count }}
                            </div>
                        </fieldset>

                        <fieldset
                            v-if="card?.might !== undefined"
                            class="rounded-lg border-2 px-4 py-1 flex gap-2 items-center"
                        >
                            <legend
                                class="font-bold"
                                style="
                                    font-family: 'BeaufortforLOLJa, sans-serif';
                                "
                            >
                                {{ $t("MIGHT") }}
                            </legend>
                            <div
                                class="inline-flex items-center justify-center"
                            >
                                <span class="font-extrabold text-3xl">{{
                                    card.might
                                }}</span>
                                <img
                                    :src="`${base}/assets/images/might.svg`"
                                    width="28"
                                    class="rounded-4xl drop-shadow-lg"
                                    alt=""
                                />
                            </div>
                        </fieldset>
                    </div>

                    <!-- 横线 -->
                    <hr
                        v-if="card?.type?.toLowerCase() !== 'battlefield'"
                        class="h-px border-1 mt-8 bg-black"
                    />

                    <!-- 描述 -->
                    <div class="px-4 py-2 text-start">
                        <div
                            class="whitespace-pre-wrap my-2.5"
                            v-html="replaceKeywords(card?.description)"
                        />
                        <div
                            v-for="f in card?.faction"
                            :key="f"
                            class="bg-black text-white inline-block px-2 py-0.5 mt-2 text-[10px] italic rounded-lg tracking-[1.5px] mr-2"
                        >
                            {{ $t(f.toUpperCase()) }}
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>

        <div
            class="fixed cursor-pointer right-5 bottom-5 text-black font-extrabold gap-2 flex items-end"
        >
            <button
                @click="goToPrevPage"
                class="hover:pb-5 transition-transform ease inline-flex gap-1"
            >
                <SquareArrowLeft size="24" />
            </button>

            |
            <div @click="backListPage" class="hover:pb-5 transition-transform ease">
                <Scroll size="24" />
            </div>
            |
            <div @click="backHomePage" class="hover:pb-5 transition-transform ease">
                <House size="24" />
            </div>
            |
            <button
                @click="goToNextPage"
                class="hover:pb-5 transition-transform inline-flex gap-1 ease "
            >
                <SquareArrowRight size="24" />
            </button>
        </div>
    </div>

    <div v-else class="p-4">Loading...</div>
</template>
