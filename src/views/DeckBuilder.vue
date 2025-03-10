<template>
    <div
        class="flex flex-col h-[calc(100vh-68px)] mt-2"
        @mousemove="updateTooltipPosition"
    >
        <!-- 主体部分 -->
        <div class="flex flex-1 overflow-hidden">
            <!-- 卡牌选择区 -->
            <aside
                class="w-1/2 md:w-3/5 bg-gray-100 overflow-hidden"
                :class="[showCardList ? 'max-w-[5000px]' : 'max-w-fit']"
            >
                <h2 class="text-lg font-semibold mb-2 flex items-center">
                    <span>卡牌</span>
                    <ChevronsRight
                        v-if="!showCardList"
                        class="mx-1"
                        :stroke-width="1.5"
                        @click="toogleCartList"
                    />
                    <ChevronsLeft
                        v-if="showCardList"
                        class="mx-1"
                        :stroke-width="1.5"
                        @click="toogleCartList"
                    />
                </h2>
                <div
                    class="overflow-y-scroll ml-4 overflow-x-hidden customScroll h-[calc(100vh-156px)] pb-3"
                >
                    <div
                        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                        :class="[showCardList ? '' : 'hidden']"
                    >
                        <div
                            v-for="card in availableCards"
                            :key="card.cardId"
                            class="bg-white shadow-md rounded py-2 px-0.5 cursor-pointer hover:scale-105 active:scale-90 hover:transition-all"
                            @mouseenter="showTooltip(card)"
                            @mouseleave="hideTooltip"
                            @click="addToDeck(card)"
                        >
                            <img
                                :src="card.imgSrc"
                                :alt="card.name"
                                class="w-full h-24 object-cover rounded object-left-top"
                            />
                            <p class="text-center mt-1 text-sm">
                                {{ card.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- 卡组构建区 -->
            <section
                class="px-4 border-l-2"
                :class="[!showCardList ? 'w-full' : 'w-1/2 md:w-2/5']"
            >
                <div
                    class="text-lg font-semibold mb-2 flex items-center justify-between gap-2"
                >
                    <h2>卡组</h2>
                    <div class="flex gap-1">
                        <LayoutGrid
                            :class="[!showCardImg ? 'opacity-25' : '']"
                            :size="22"
                            @click="showCardImg = true"
                        />
                        <List
                            :class="[showCardImg ? 'opacity-25' : '']"
                            :size="22"
                            @click="showCardImg = false"
                        />
                    </div>
                </div>

                <div
                    id="deck"
                    class="h-[calc(100vh-156px)] pb-3 overflow-y-scroll customScroll"
                >
                    <div
                        class="flex gap-2"
                        :class="[
                            showCardImg ? 'w-fit' : '',
                            showCardList ? 'justify-between' : '',
                        ]"
                    >
                        <!-- 传奇 -->
                        <fieldset
                            class="border-1 px-2 py-1.5 rounded-md"
                            :class="[!showCardImg ? 'h-28' : 'h-full']"
                        >
                            <legend class="text-md font-semibold">
                                {{ $t("LEGEND") }}
                            </legend>

                            <div
                                v-if="selectedDeck.legend"
                                @mouseenter="showTooltip(selectedDeck.legend)"
                                @mouseleave="hideTooltip"
                            >
                                <div v-if="!showCardImg">
                                    <p class="text-2xl font-bold">
                                        {{ selectedDeck.legend.name }}
                                    </p>
                                    <p class="text-md font-medium">
                                        {{ $t("LEGEND_CHAMPION") }}:{{ " " }}
                                        {{ selectedDeck.legend.champion }}
                                    </p>
                                </div>
                                <div class="text-center" v-if="showCardImg">
                                    <img
                                        :src="selectedDeck.legend.imgSrc"
                                        :alt="selectedDeck.legend.name"
                                        class="max-w-[150px]"
                                    />
                                    <p class="font-bold">
                                        {{ selectedDeck.legend.name }}
                                    </p>
                                </div>
                            </div>
                            <div
                                v-else
                                class="h-full flex justify-center items-center"
                            >
                                <p class="opacity-50">
                                    {{ $t("PICK A LEGEND") }}
                                </p>
                            </div>
                        </fieldset>

                        <!-- runes -->
                        <fieldset
                            class="border-1 px-2 py-1.5 rounded-md"
                            :class="[!showCardImg ? 'h-28' : 'h-full']"
                        >
                            <legend class="text-md font-semibold">
                                {{ $t("RUNE") }}（{{ totalCount }}/12）
                            </legend>
                            <div v-if="selectedDeck.legend" class="flex gap-4">
                                <div
                                    v-for="(r, index) in selectedDeck.runes"
                                    :key="r"
                                    class="px-2"
                                >
                                    <div class="h-full items-center">
                                        <img
                                            v-if="!showCardImg"
                                            class="rounded-4xl shadow-lg mx-auto"
                                            :src="getRuneImageUrl(r.rune)"
                                            alt="CALM"
                                            title="冷静"
                                            width="50px"
                                        />

                                        <img
                                            v-else
                                            @mouseenter="showTooltip(r)"
                                            @mouseleave="hideTooltip"
                                            :src="r.imgSrc"
                                            :alt="r.rune"
                                            class="max-w-[150px]"
                                        />
                                        <div
                                            class="flex items-center justify-center gap-1.5"
                                        >
                                            <Minus
                                                class="rounded-xl border-1"
                                                :size="16"
                                                @click="decreaseCount(index)"
                                            />
                                            <p class="font-bold">
                                                {{ r.count }}
                                            </p>
                                            <Plus
                                                class="rounded-xl border-1"
                                                :size="16"
                                                @click="increaseCount(index)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                v-else
                                class="h-full flex justify-center items-center"
                            >
                                <p class="opacity-50">
                                    {{ $t("PICK A LEGEND") }}
                                </p>
                            </div>
                        </fieldset>
                    </div>

                    <fieldset class="border-1 px-2 py-1.5 rounded-md">
                        <legend class="text-md font-semibold">
                            {{ $t("UNIT") }}（{{ totalCard }}/40）
                        </legend>
                        <div
                            v-if="selectedDeck.units.length > 0"
                            class="grid grid-cols-1"
                            :class="[
                                !showCardList
                                    ? 'sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
                                    : 'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
                            ]"
                        >
                            <div
                                v-for="(card, index) in selectedDeck.units"
                                :key="card.cardId"
                                class="gap-2 p-2 cursor-pointer mx-1"
                                @mouseenter="showTooltip(card)"
                                @mouseleave="hideTooltip"
                                @click="removeFromDeck(index, 'card')"
                            >
                                <div
                                    v-if="!showCardImg"
                                    class="flex items-center justify-between border-b"
                                >
                                    <div>
                                        <small>{{ card.cardId }}</small>
                                        <p class="text-sm">{{ card.name }}</p>
                                    </div>

                                    <div>
                                        {{ card.count }}
                                    </div>
                                </div>

                                <div v-else>
                                    <img
                                        :src="card.imgSrc"
                                        :alt="card.name"
                                        class="max-w-[150px] mx-auto"
                                    />
                                    <div class="font-bold text-center">
                                        {{ card.count }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="h-full flex justify-center items-center my-20"
                        >
                            <p class="opacity-50">{{ $t("PICK_UNITS") }}</p>
                        </div>
                    </fieldset>

                    <!-- battlefield -->
                    <fieldset class="border-1 px-2 py-1.5 rounded-md">
                        <legend class="text-md font-semibold">
                            {{ $t("BATTLEFIELD") }}（{{
                                selectedDeck.battlefield.length
                            }}/3）
                        </legend>
                        <div
                            v-if="selectedDeck.battlefield.length > 0"
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        >
                            <div
                                v-for="(
                                    card, index
                                ) in selectedDeck.battlefield"
                                :key="card.cardId"
                                :class="[!showCardImg ? ' border-b ' : '']"
                                class="gap-2 p-2 cursor-pointer mx-1"
                                @mouseenter="showTooltip(card)"
                                @mouseleave="hideTooltip"
                                @click="removeFromDeck(index, 'bf')"
                            >
                                <div v-if="!showCardImg">
                                    <small>{{ card.cardId }}</small>
                                    <p class="text-sm">{{ card.name }}</p>
                                </div>

                                <img
                                    v-else
                                    :src="card.imgSrc"
                                    :alt="card.name"
                                    class="max-h-[200px] mx-auto"
                                />
                            </div>
                        </div>
                        <div
                            v-else
                            class="h-full flex justify-center items-center my-20"
                        >
                            <p class="opacity-50">{{ $t("PICK_BF") }}</p>
                        </div>
                    </fieldset>
                </div>
            </section>
        </div>

        <!-- Tooltip -->
        <div
            v-if="tooltipCard"
            class="fixed p-2 bg-gray-200 text-black text-xs rounded shadow-lg max-w-52 min-w-40"
            :style="{
                top: tooltipPosition.y + 'px',
                left: tooltipPosition.x + 'px',
            }"
        >
            <img
                v-if="!showCardImg"
                :src="tooltipCard.imgSrc"
                alt=""
                class="w-full max-w-[100px] mx-auto rounded-md"
            />
            <p class="font-bold text-center my-0.5">{{ tooltipCard.name }}</p>
            <div
                class="whitespace-pre-wrap mb-1"
                v-html="replaceKeywords(tooltipCard?.description)"
            />
        </div>

        <footer class="p-4 bg-gray-200 flex justify-between">
            <button
                class="text-sm bg-red-500 px-3 py-1 rounded"
                @click="clearDeck"
            >
                清除所有
            </button>
            <button @click="convertToImg">Convert To Img</button>
            <div class="flex">
                <label>显示小卡片</label>
                <input
                    type="checkbox"
                    :checked="canShowTooltips"
                    @click="toogleShow"
                />
            </div>

            <button class="text-sm bg-green-500 px-3 py-1 rounded">确认</button>
        </footer>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import replaceKeywords from "@/helpers/keyMap.js";
import { ChevronsRight } from "lucide-vue-next";
import { ChevronsLeft } from "lucide-vue-next";
import { Plus } from "lucide-vue-next";
import { Minus } from "lucide-vue-next";
import { LayoutGrid } from "lucide-vue-next";
import { List } from "lucide-vue-next";

const base = import.meta.env.BASE_URL;
const showCardList = ref(true);
const showCardImg = ref(false);
const canShowTooltips = ref(false);
const runesImage = ref([]);

onMounted(async () => {
    const response = await fetch(base + "/assets/data/cards-cn.json");
    const data = await response.json();
    data.forEach((d) => {
        if (d.type.toLowerCase() === "rune") {
            runesImage.value.push({ ...d, rune: d.runeColor[0] });
        }
    });
    availableCards.value = data.filter(
        (c) => !["rune"].includes(c.type.toLowerCase())
    );
});

const availableCards = ref();

const selectedDeck = ref({
    legend: null,
    runes: [],
    legend_champion_present: false,
    units: [],
    battlefield: [],
});

const totalCard = computed(() => {
    if (selectedDeck.value.units.length === 0) return 0;
    return selectedDeck.value.units.reduce((sum, r) => sum + r.count, 0);
});

const tooltipCard = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });

const showTooltip = (card) => {
    if (!canShowTooltips.value) {
        hideTooltip();
        return;
    }
    tooltipCard.value = card;
};

const hideTooltip = () => {
    tooltipCard.value = null;
};

const updateTooltipPosition = (event) => {
    tooltipPosition.value = {
        x: event.clientX + 10,
        y: event.clientY + 10,
    };
};

const addToDeck = (card) => {
    const sDeck = selectedDeck.value;
    switch (card.type.toLowerCase()) {
        case "legend":
            sDeck.legend = card;
            const newRunes = [];
            for (const rune of card.runes) {
                const runeData =
                    runesImage.value.find(
                        (r) => r.rune.toUpperCase() === rune.toUpperCase()
                    ) || {};
                const newRune = {
                    ...runeData,
                    count: card.runes.length > 0 ? 12 / card.runes.length : 0,
                };
                newRunes.push(newRune);
            }
            sDeck.runes = newRunes;
            break;
        case "battlefield": {
            const index = sDeck.battlefield.findIndex(
                (c) => card.cardId === c.cardId
            );
            if (index === -1) {
                sDeck.battlefield.push(card);
            } else {
                // notice added
            }
            break;
        }
        default: {
            if (totalCard.value === 40) return;
            const index = sDeck.units.findIndex(
                (c) => card.cardId === c.cardId
            );
            if (index === -1) {
                sDeck.units.push({ ...card, count: 1 });
            } else {
                if (sDeck.units[index].count < 3) {
                    sDeck.units[index].count++;
                } else {
                    // notice added
                }
            }
            break;
        }
    }
};

const removeFromDeck = (index, type) => {
    switch (type) {
        case "bf":
            selectedDeck.value.battlefield.splice(index, 1);
            break;
        case "card":
            selectedDeck.value.units[index].count--;
            if (selectedDeck.value.units[index].count === 0) {
                selectedDeck.value.units.splice(index, 1);
            }
            break;
        default:
            break;
    }
    hideTooltip();
};

const clearDeck = () => {
    selectedDeck.value = {
        legend: null,
        runes: [],
        legend_champion_present: false,
        units: [],
        battlefield: [],
    };
};

const toogleCartList = () => {
    showCardList.value = !showCardList.value;
};

const getRuneImageUrl = (rune) => {
    return `${base}/assets/images/${rune.toUpperCase()}.webp`;
};

// rune count part
const totalCount = computed(() => {
    if (selectedDeck.value.runes.length === 0) return 0;
    return selectedDeck.value.runes.reduce((sum, r) => sum + r.count, 0);
});

const increaseCount = (index) => {
    if (totalCount.value >= 12) return;
    selectedDeck.value.runes[index].count++;

    while (totalCount.value > 12) {
        let reduceIndex = selectedDeck.value.runes.findIndex(
            (r, i) => r.count > 1 && i !== index
        );
        if (reduceIndex !== -1) selectedDeck.value.runes[reduceIndex].count--;
    }
};

const decreaseCount = (index) => {
    if (selectedDeck.value.runes[index].count > 1) {
        selectedDeck.value.runes[index].count--;
    }
};

const toogleShow = () => {
    canShowTooltips.value = !canShowTooltips.value;
};

</script>

<style>
* {
    user-select: none;
}
</style>
