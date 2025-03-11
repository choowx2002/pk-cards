<template>
    <Notify ref="notifyRef" />
    <div
        class="flex flex-col h-[calc(100vh-68px)] mt-2"
        @mousemove="updateTooltipPosition"
        ref="deckBuilder"
    >
        <!-- 主体部分 -->
        <div class="flex flex-1 overflow-hidden">
            <!-- 卡牌选择区 -->
            <aside
                class="w-1/2 md:w-3/5 bg-gray-100 overflow-hidden"
                :class="[showCardList ? 'max-w-[5000px]' : 'max-w-fit']"
            >
                <h2 class="mb-2 flex justify-between items-center w-full">
                    <div
                        class="flex gap-2 pl-4 items-center w-full"
                        v-if="showCardList"
                    >
                        <!-- filter area -->
                        <div
                            class="flex gap-2 text-sm items-center flex-wrap w-full"
                        >
                            <!-- seacrh -->
                            <div class="border-2 py-0.5 px-2 rounded-lg">
                                <label class="border-r-1 pr-1">{{
                                    $t("SEARCH")
                                }}</label>
                                <input
                                    type="text"
                                    aria-colspan="4"
                                    class="pl-1 focus:border-0 focus:outline-0"
                                    v-model="filters.search"
                                />
                            </div>

                            <!-- keyword -->
                            <div>
                                <label>{{ $t("KEYWORD") }}: </label>
                                <select
                                    class="focus:border-0 focus:outline-0"
                                    v-model="filters.keyword"
                                >
                                    <option value="all">
                                        {{ $t("ALL") }}
                                    </option>
                                    <option
                                        :value="k"
                                        :key="k"
                                        v-for="k in KeywordList"
                                    >
                                        {{ $t(k.toUpperCase()) }}
                                    </option>
                                </select>
                            </div>

                            <!-- card type -->
                            <div>
                                <label>{{ $t("TYPE") }}: </label>
                                <select
                                    class="focus:border-0 focus:outline-0"
                                    v-model="filters.type"
                                >
                                    <option value="all">
                                        {{ $t("ALL") }}
                                    </option>
                                    <option
                                        :value="t"
                                        :key="t"
                                        v-for="t in CardTypes"
                                    >
                                        {{ $t(t.toUpperCase()) }}
                                    </option>
                                </select>
                            </div>

                            <!-- rune -->
                            <div>
                                <label>{{ $t("RUNE") }}: </label>
                                <select
                                    class="focus:border-0 focus:outline-0"
                                    v-model="filters.rune"
                                >
                                    <option value="all">
                                        {{ $t("ALL") }}
                                    </option>
                                    <option
                                        :value="r"
                                        :key="r"
                                        :style="{
                                            backgroundColor: runeColorsCss[r],
                                        }"
                                        class="text-white hover:bg-white hover:text-black px-1 py-0.5"
                                        v-for="r in Runes"
                                    >
                                        {{ $t(r.toUpperCase()) }}
                                    </option>
                                </select>
                            </div>

                            <!-- energy cost -->
                            <div>
                                <label>{{ $t("ENERGY") }}: </label>
                                <select
                                    class="focus:border-0 focus:outline-0"
                                    v-model="filters.energy"
                                >
                                    <option value="all">{{ $t("ALL") }}</option>
                                    <option
                                        :value="n"
                                        v-for="n in [
                                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                            12,
                                        ]"
                                        :key="n"
                                    >
                                        {{ n }}
                                    </option>
                                </select>
                            </div>

                            <!-- power cost -->
                            <div>
                                <label>{{ $t("POWER") }}: </label>
                                <select
                                    class="focus:border-0 focus:outline-0"
                                    v-model="filters.power"
                                >
                                    <option value="all">{{ $t("ALL") }}</option>
                                    <option
                                        :value="n"
                                        v-for="n in [1, 2, 3]"
                                        :key="n"
                                    >
                                        {{ n }}
                                    </option>
                                </select>
                            </div>

                            <!-- might cost -->
                            <div>
                                <label>{{ $t("MIGHT") }}: </label>
                                <select
                                    class="focus:border-0 focus:outline-0"
                                    v-model="filters.might"
                                >
                                    <option value="all">{{ $t("ALL") }}</option>
                                    <option
                                        :value="n"
                                        v-for="n in [
                                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                                            12,
                                        ]"
                                        :key="n"
                                    >
                                        {{ n }}
                                    </option>
                                </select>
                            </div>
                            <div class="ml-auto">
                                <button
                                    @click="resetFilters"
                                    class="border-1 px-2 py-0.5 text-sm rounded-md"
                                >
                                    {{ $t("RESET") }}
                                </button>
                            </div>
                        </div>
                    </div>

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
                            v-for="card in filteredCards"
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
                    <div
                        class="flex justify-center items-center overflow-hidden rounded-md border-1 border-gray-700"
                    >
                        <div
                            @click="showCardImg = false"
                            class="p-1"
                            :class="[
                                !showCardImg ? 'bg-teal-700' : 'bg-gray-700',
                            ]"
                        >
                            <List
                                :class="[!showCardImg ? 'text-white' : '']"
                                :size="16"
                            />
                        </div>
                        <div
                            @click="showCardImg = true"
                            class="p-1"
                            :class="[showCardImg ? 'bg-teal-700' : '']"
                        >
                            <LayoutGrid
                                :class="[
                                    showCardImg ? 'text-white' : 'text-black',
                                ]"
                                :size="16"
                            />
                        </div>
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
                            showCardList ? '' : '',
                        ]"
                    >
                        <!-- 传奇 -->
                        <fieldset
                            class="border-1 px-2 py-1.5 rounded-md"
                            :class="[!showCardImg ? 'h-28' : 'h-full min-h-28']"
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
                            :class="[!showCardImg ? 'h-28' : 'h-full min-h-28']"
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
                                    class="flex items-end justify-between border-b"
                                >
                                    <div>
                                        <small>{{ card.cardId }}</small>
                                        <p class="text-sm">{{ card.name }}</p>
                                    </div>

                                    <div>x {{ card.count }}</div>
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
            ref="tooltip"
            v-if="tooltipCard"
            class="fixed p-2 bg-gray-200 text-black text-sm rounded shadow-lg max-w-52 min-w-40"
            :style="{
                top: tooltipPosition.y + 'px',
                left: tooltipPosition.x + 'px',
            }"
        >
            <img
                v-if="!showCardImg"
                :src="tooltipCard.imgSrc"
                alt=""
                class="mx-auto max-w-[100px] rounded-md"
            />
            <p class="font-bold text-center my-0.5">
                {{ tooltipCard.name }}
            </p>
            <div class="flex w-full gap-2 justify-center">
                <!-- might -->
                <div v-if="tooltipCard?.might" class="flex items-center">
                    <img
                        :src="base + 'assets/images/might.svg'"
                        width="12"
                        alt=""
                    />
                    <span>:{{ tooltipCard.might }}</span>
                </div>

                <!-- energy -->
                <div v-if="tooltipCard?.cost?.energy" class="flex items-center">
                    <img
                        :src="
                            base +
                            'assets/images/energy-' +
                            tooltipCard.cost.energy +
                            '.svg'
                        "
                        width="12"
                        alt=""
                    />
                    <span>:{{ tooltipCard.cost.energy }}</span>
                </div>

                <!-- power -->
                <div v-if="tooltipCard?.cost?.power" class="flex items-center">
                    <img
                        :src="base + 'assets/images/rune.svg'"
                        width="12"
                        alt=""
                    />
                    <span>:{{ tooltipCard.cost.power.count }}</span>
                </div>
            </div>
            <div
                class="whitespace-pre-wrap mb-1 py-2 px-1 border-y-2"
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
            <div class="flex mr-auto ml-1">
                <label>显示小卡片</label>
                <input
                    type="checkbox"
                    :checked="canShowTooltips"
                    @click="toogleShow"
                />
                <label>显示卡组信息</label>
                <input
                    type="checkbox"
                    :checked="showStatus"
                    @click="showStatus = !showStatus"
                />
            </div>

            <button
                class="text-sm bg-green-400 px-3 py-1 flex rounded items-center gap-2"
                @click="copy"
            >
                {{ $t("COPY") }} <Copy :size="15" />
            </button>
        </footer>
    </div>
    <DraggableDiv v-if="showStatus" :initialPosition="{ x: 200, y: 150 }" :data="{...deckDescription, legendChampionPresent: selectedDeck.legend_champion_present}"/>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import replaceKeywords from "@/helpers/keyMap.js";
import { ChevronsRight } from "lucide-vue-next";
import { ChevronsLeft } from "lucide-vue-next";
import { Plus } from "lucide-vue-next";
import { Minus } from "lucide-vue-next";
import { LayoutGrid } from "lucide-vue-next";
import { List } from "lucide-vue-next";
import Notify from "@/components/Notify.vue";
import DraggableDiv from "@/components/DraggableDiv.vue";
import {
    Runes,
    runeColorsCss,
    CardTypes,
    KeywordList,
    KeywordColors,
} from "/src/constant.js";
import { Copy } from "lucide-vue-next";

const base = import.meta.env.BASE_URL;
const showCardList = ref(true);
const showCardImg = ref(false);
const canShowTooltips = ref(true);
const runesImage = ref([]);
const notifyRef = ref(null);
const deckBuilder = ref(null);
const tooltip = ref(null);
const showStatus = ref(false);

const filters = ref({
    search: "",
    keyword: "all",
    type: "all",
    rune: "all",
    energy: "all",
    power: "all",
    might: "all",
});

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

const availableCards = ref([]);

const filteredCards = computed(() => {
    return availableCards.value.filter((card) => {
        return (
            (filters.value.search === "" ||
                card.cardId.includes(filters.value.search) ||
                card.name.includes(filters.value.search)) &&
            (filters.value.keyword === "all" ||
                card.keywords
                    .map((k) => k.name)
                    .includes(filters.value.keyword)) &&
            (filters.value.type === "all" ||
                card.type === filters.value.type) &&
            (filters.value.rune === "all" ||
                (card?.runeColor &&
                    card.runeColor.includes(filters.value.rune))) &&
            (filters.value.energy === "all" ||
                card?.cost?.energy === parseInt(filters.value.energy)) &&
            (filters.value.power === "all" ||
                card?.cost?.power.count === parseInt(filters.value.power)) &&
            (filters.value.might === "all" ||
                card?.might === parseInt(filters.value.might))
        );
    });
});

const selectedDeck = ref({
    legend: null,
    runes: [],
    legend_champion_present: false,
    units: [],
    battlefield: [],
});

const deckDescription = ref({
    unitsTypes: {},
    energydistributed: {},
    powerdistributed: {},
    mightdistributed: {},
    runedistributed: {},
});

watch(
    selectedDeck,
    (deck) => {
        if (deck.legend) {
            // check legend's champion present in deck or not  
            deck.legend_champion_present = deck.units.some(
                (unit) => unit.name === deck.legend.champion
            );
        }
        if (deck.units.length > 0) {
            // update deck description
            deckDescription.value = deck.units.reduce(
                (desc, unit) => {
                    // Update unit types count
                    desc.unitsTypes[unit.type] =
                        (desc.unitsTypes[unit.type] || 0) + unit.count;

                    // Update energy distribution
                    if (unit.cost?.energy) {
                        desc.energydistributed[unit.cost.energy] =
                            (desc.energydistributed[unit.cost.energy] || 0) +
                            unit.count;
                    }

                    // Update power distribution
                    if (unit?.cost?.power.count) {
                        desc.powerdistributed[unit.cost.power.count] =
                            (desc.powerdistributed[unit.cost.power.count] ||
                                0) + unit.count;
                    }

                    // Update might distribution
                    if (unit.might) {
                        desc.mightdistributed[unit.might] =
                            (desc.mightdistributed[unit.might] || 0) +
                            unit.count;
                    }

                    // Update rune distribution
                    if (unit.runeColor.length > 0) {
                        unit.runeColor.forEach((rune) => {
                            desc.runedistributed[rune] =
                                (desc.runedistributed[rune] || 0) + unit.count;
                        });
                    }

                    return desc;
                },
                {
                    unitsTypes: {},
                    energydistributed: {},
                    powerdistributed: {},
                    mightdistributed: {},
                    runedistributed: {},
                }
            );
        } else {
            deckDescription.value = {
                unitsTypes: {},
                energydistributed: {},
                powerdistributed: {},
                mightdistributed: {},
                runedistributed: {},
            };
        }

        console.log(deckDescription.value);
    },
    { deep: true }
);

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
    if (!tooltip.value) return;
    const { clientX: x, clientY: y } = event;
    const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } =
        tooltip.value;
    const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
        deckBuilder.value;
    tooltipPosition.value = {
        x: x + tooltipWidth > containerWidth ? x - tooltipWidth - 5 : x + 10,
        y: y + tooltipHeight > containerHeight ? y - tooltipHeight - 5 : y + 10,
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
            if (sDeck.battlefield.length === 3)
                return notifyRef.value?.addNotification(
                    "战场上的卡牌数量已达到上限。",
                    "info"
                );
            const index = sDeck.battlefield.findIndex(
                (c) => card.cardId === c.cardId
            );
            if (index === -1) {
                sDeck.battlefield.push(card);
            } else {
                notifyRef.value?.addNotification(
                    `"${card.name}"在卡组里的数量已达到上限。`,
                    "info"
                );
            }
            break;
        }
        case "unit": {
            const isRecruit = (carId) => {
                return ["FND-273/298"].includes(carId);
            };
            if (isRecruit(card.cardId))
                return notifyRef.value?.addNotification(
                    `"${card.name}"不能添加。`,
                    "info"
                );
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
                    notifyRef.value?.addNotification(
                        `"${card.name}"在卡组里的数量已达到上限。`,
                        "info"
                    );
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

const resetFilters = () => {
    filters.value = {
        search: "",
        keyword: "all",
        type: "all",
        rune: "all",
        energy: "all",
        power: "all",
        might: "all",
    };
};

const copy = () => {
    const deckList = [];

    // 处理 Legend（只有一张）
    if (selectedDeck.value.legend) {
        deckList.push(`1x${selectedDeck.value.legend.cardId}`);
    }

    // 处理符文（Runes）
    selectedDeck.value.runes.forEach((r) => {
        deckList.push(`${r.count}x${r.cardId}`);
    });

    // 处理战场（Battlefield）
    selectedDeck.value.battlefield.forEach((b) => {
        deckList.push(`1x${b.cardId}`);
    });

    // 处理单位（Units，包含其它卡牌）
    selectedDeck.value.units.forEach((u) => {
        deckList.push(`${u.count}x${u.cardId}`);
    });

    // 生成最终文本格式
    const formattedText = deckList.join("\n");

    // 复制到剪贴板
    if (!navigator.clipboard) {
        return notifyRef.value?.addNotification(
            "浏览器不支持复制到剪贴板。",
            "error"
        );
    }
    if (!formattedText) {
        return notifyRef.value?.addNotification("卡组为空。", "warning");
    }
    navigator.clipboard.writeText(formattedText);
    notifyRef.value?.addNotification("卡组文本已复制。", "success");
};
</script>

<style>
* {
    user-select: none;
}

select {
    border: 0.5px solid #000000;
    border-radius: 0.25rem;
}
</style>
