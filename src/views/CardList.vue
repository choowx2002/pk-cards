<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    Runes,
    runeColorsCss,
    CardTypes,
    KeywordList,
    KeywordColors,
} from "/src/constant.js";

const base = import.meta.env.BASE_URL;
const router = useRouter();
const route = useRoute();
const showMore = ref(false);
const selectedRunes = ref([]);
const selectedTypes = ref([]);
const selectedKeys = ref([]);
const searchKey = ref("");
const withAnd = ref(false);
const might = ref({ min: "", max: "" });
const energy = ref({ min: "", max: "" });
const power = ref({ min: "", max: "" });
const cards = ref([]);
const currentPage = ref(1);
const cardsPerPage = ref(20);
const observer = ref(null);
const bottomElement = ref(null);

onMounted(async () => {
    try {
        const response = await fetch(base + "/assets/data/cards-cn.json");
        const data = await response.json();
        // cards.value = data.slice(0, 10);
        cards.value = data;
    } catch (error) {
        console.error("Failed to load card data:", error);
    }

    loadFiltersFromQuery();
    setupObserver();
});

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
});

const loadFiltersFromQuery = () => {
    const query = route.query;

    searchKey.value = query.searchKey || "";
    withAnd.value = query.withAnd === "true";
    showMore.value = query.showMore === "true";

    selectedRunes.value = query.selectedRunes
        ? query.selectedRunes.split(",")
        : [];
    selectedTypes.value = query.selectedTypes
        ? query.selectedTypes.split(",")
        : [];
    selectedKeys.value = query.selectedKeys
        ? query.selectedKeys.split(",")
        : [];

    might.value = {
        min: query.mightMin || "",
        max: query.mightMax || "",
    };
    energy.value = {
        min: query.energyMin || "",
        max: query.energyMax || "",
    };
    power.value = {
        min: query.powerMin || "",
        max: query.powerMax || "",
    };
};

const setupObserver = () => {
    observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    });

    if (bottomElement.value) {
        observer.value.observe(bottomElement.value);
    }
};

watch(
    [
        searchKey,
        selectedRunes,
        selectedTypes,
        selectedKeys,
        withAnd,
        might,
        energy,
        power,
    ],
    () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        currentPage.value = 1;
        updateQueryParams();
    },
    { deep: true }
);

const updateQueryParams = () => {
    router.push({
        path: route.path,
        query: {
            searchKey: searchKey.value || undefined,
            selectedRunes: selectedRunes.value.length
                ? selectedRunes.value.join(",")
                : undefined,
            selectedTypes: selectedTypes.value.length
                ? selectedTypes.value.join(",")
                : undefined,
            selectedKeys: selectedKeys.value.length
                ? selectedKeys.value.join(",")
                : undefined,
            withAnd: withAnd.value ? "true" : undefined,
            mightMin: might.value.min || undefined,
            mightMax: might.value.max || undefined,
            energyMin: energy.value.min || undefined,
            energyMax: energy.value.max || undefined,
            powerMin: power.value.min || undefined,
            powerMax: power.value.max || undefined,
            showMore: showMore.value ? "true" : undefined,
        },
    });
};

const filteredCards = computed(() => {
    const filtered = cards.value.filter((card) => {
        return (
            matchesSearch(card) &&
            matchesRunes(card) &&
            matchesTypes(card) &&
            matchesKeys(card) &&
            matchesMight(card) &&
            matchesEnergy(card) &&
            matchesPower(card)
        );
    });

    const startIndex = 0;
    const endIndex = currentPage.value * cardsPerPage.value;
    return filtered.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
    const filtered = cards.value.filter((card) => {
        return (
            matchesSearch(card) &&
            matchesRunes(card) &&
            matchesTypes(card) &&
            matchesKeys(card) &&
            matchesMight(card) &&
            matchesEnergy(card) &&
            matchesPower(card)
        );
    });
    return Math.ceil(filtered.length / cardsPerPage.value);
});

// Search filter
const matchesSearch = (card) => {
    if (!searchKey.value) return true;
    return (
        card.name.includes(searchKey.value) ||
        card.cardId.includes(searchKey.value)
    );
};

// Rune filter
const matchesRunes = (card) => {
    if (!selectedRunes.value.length) return true;
    if (!card.runeColor?.length) return false;
    return withAnd.value
        ? selectedRunes.value.every((r) => card.runeColor.includes(r))
        : selectedRunes.value.some((r) => card.runeColor.includes(r));
};

// Type filter
const matchesTypes = (card) => {
    return (
        !selectedTypes.value.length || selectedTypes.value.includes(card.type)
    );
};

// Keyword filter
const matchesKeys = (card) => {
    if (!selectedKeys.value.length) return true;
    const onlyAcceptEmpty =
        selectedKeys.value.includes("NoKeywords") &&
        selectedKeys.value.length === 1;
    return onlyAcceptEmpty
        ? card.keywords?.length === 0
        : selectedKeys.value.some((k) =>
              card.keywords.some((kw) => kw.name === k)
          );
};

// Might filter
const matchesMight = (card) => {
    if(!card?.might) return false;
    return (
        (might.value.min === "" || card.might >= might.value.min) &&
        (might.value.max === "" || card.might <= might.value.max)
    );
};

// Energy filter
const matchesEnergy = (card) => {
    if(!card?.cost?.energy) return false;
    return (
        (energy.value.min === "" || card.cost.energy >= energy.value.min) &&
        (energy.value.max === "" || card.cost.energy <= energy.value.max)
    );
};

// Power filter
const matchesPower = (card) => {
    if (power.value.min === "" && power.value.max === "") return true;
    if (!card?.cost?.power?.count) return false;
    return (
        (power.value.min === "" || card.cost.power.count >= power.value.min) &&
        (power.value.max === "" || card.cost.power.count <= power.value.max)
    );
};

const filteredKeywordList = computed(() => {
    return KeywordList.filter((key) => !selectedKeys.value.includes(key));
});

const removeKeys = (index) => {
    selectedKeys.value.splice(index, 1);
};

const optionChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue !== "none") {
        selectedKeys.value.push(selectedValue);
    }
    event.target.value = "none";
};

const routeTo = (id) => {
    router.push({ path: "/card", query: { cardId: encodeURIComponent(id) } });
};

const toggleRuneSelection = (rune) => {
    const index = selectedRunes.value.indexOf(rune);
    if (index !== -1) {
        selectedRunes.value.splice(index, 1);
    } else {
        selectedRunes.value.push(rune);
    }
};

const toggleTypeSelection = (rune) => {
    const index = selectedTypes.value.indexOf(rune);
    if (index !== -1) {
        selectedTypes.value.splice(index, 1);
    } else {
        selectedTypes.value.push(rune);
    }
};

const toggleWithAnd = () => {
    withAnd.value = !withAnd.value;
};

const toogleShowMore = () => {
    showMore.value = !showMore.value;
};

const resetFilters = () => {
    searchKey.value = "";
    selectedRunes.value = [];
    selectedTypes.value = [];
    selectedKeys.value = [];
    withAnd.value = false;
    might.value = { min: "", max: "" };
    energy.value = { min: "", max: "" };
    power.value = { min: "", max: "" };
    currentPage.value = 1;
};
</script>

<template>
    <div class="max-w-[1300px] mx-auto md:flex bg-gray-100 mt-2">
        <!-- 左侧筛选栏 -->
        <aside class="md:w-2/5 p-4 bg-white shadow-lg pt-3 md:h-fit">
            <!-- name and id -->
            <div class="w-full py-1 px-2">
                <label class="text-lg font-semibold"
                    >{{ $t("CARD NAME") }}/{{ $t("ID") }}:</label
                >
                <input
                    v-model="searchKey"
                    placeholder="卡牌名字/编号"
                    class="w-full px-2 py-1 border-b-2 focus:outline-0"
                />
            </div>

            <!-- MORE -->
            <div class="px-2 pt-1 flex gap-2 font-bold">
                <span>{{ $t("MORE") }}</span>
                <input
                    type="checkbox"
                    :checked="showMore"
                    @click="toogleShowMore"
                />
            </div>

            <div
                class="w-full px-2 max-h-0 overflow-hidden justify-items-start grid gap-3 p-0 sm:grid-cols-2 md:grid-cols-1"
                :class="showMore ? 'max-h-[1000px]' : ''"
                style="transition: all 0.3s ease"
            >
                <!-- runes -->
                <div>
                    <div class="flex justify-between items-center">
                        <label class="text-lg font-semibold"
                            >{{ $t("RUNE") }}:</label
                        >
                        <div>
                            <span class="font-semibold">约束</span>
                            <input
                                type="checkbox"
                                :checked="withAnd"
                                @click="toggleWithAnd"
                            />
                        </div>
                    </div>

                    <div class="flex gap-1">
                        <div
                            v-for="rune in Runes"
                            :key="rune"
                            class="shadow-lg rounded-4xl h-min overflow-hidden"
                            :style="
                                selectedRunes.includes(rune)
                                    ? {
                                          background:
                                              runeColorsCss[rune] ?? 'black',
                                      }
                                    : {}
                            "
                        >
                            <img
                                :src="`${base}/assets/images/${rune.toUpperCase()}.webp`"
                                :alt="rune"
                                :title="$t(rune.toUpperCase())"
                                class="transition-transform p-0.5 ease-out hover:scale-110"
                                :class="
                                    selectedRunes.includes(rune)
                                        ? 'white-image'
                                        : ''
                                "
                                width="40"
                                @click="toggleRuneSelection(rune)"
                            />
                        </div>
                    </div>
                </div>

                <!-- type -->
                <div>
                    <label class="text-lg font-semibold"
                        >{{ $t("TYPE") }}:</label
                    >
                    <div class="flex gap-1">
                        <div
                            v-for="type in CardTypes"
                            :key="type"
                            class="shadow-lg rounded-4xl h-min overflow-hidden"
                            :style="
                                selectedTypes.includes(type)
                                    ? { background: 'black' }
                                    : {}
                            "
                        >
                            <img
                                :src="`${base}/assets/images/${type.toLowerCase()}.svg`"
                                :alt="type"
                                :title="$t(type.toUpperCase())"
                                class="transition-transform p-1.5 ease-out hover:scale-110"
                                :class="
                                    selectedTypes.includes(type)
                                        ? 'white-image'
                                        : ''
                                "
                                width="40"
                                @click="toggleTypeSelection(type)"
                            />
                        </div>
                    </div>
                </div>

                <!-- might -->
                <div>
                    <div class="flex justify-between">
                        <label class="text-lg font-semibold"
                            >{{ $t("MIGHT") }}:</label
                        >
                    </div>

                    <div class="flex gap-2">
                        <input
                            v-model.number="might.min"
                            type="number"
                            placeholder="最小值"
                            class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                        />
                        <span class="h-0.5 w-2 bg-black my-auto"></span>
                        <input
                            v-model.number="might.max"
                            type="number"
                            placeholder="最大值"
                            class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                        />
                    </div>
                </div>

                <!-- energy -->
                <div>
                    <div class="flex justify-between">
                        <label class="text-lg font-semibold"
                            >{{ $t("ENERGY") }}:</label
                        >
                    </div>

                    <div class="flex gap-2">
                        <input
                            v-model.number="energy.min"
                            type="number"
                            placeholder="最小值"
                            class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                        />
                        <span class="h-0.5 w-2 bg-black my-auto"></span>
                        <input
                            v-model.number="energy.max"
                            type="number"
                            placeholder="最大值"
                            class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                        />
                    </div>
                </div>

                <!-- power -->
                <div>
                    <div class="flex justify-between">
                        <label class="text-lg font-semibold"
                            >{{ $t("POWER") }}:</label
                        >
                    </div>

                    <div class="flex gap-2">
                        <input
                            v-model.number="power.min"
                            type="number"
                            placeholder="最小值"
                            class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                        />
                        <span class="h-0.5 w-2 bg-black my-auto"></span>
                        <input
                            v-model.number="power.max"
                            type="number"
                            placeholder="最大值"
                            class="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                        />
                    </div>
                </div>

                <!-- keywords -->
                <div class="w-full">
                    <div class="flex justify-between">
                        <label class="text-lg font-semibold"
                            >{{ $t("KEYWORDS") }}:</label
                        >
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <template
                            v-for="(key, index) in selectedKeys"
                            :key="index"
                        >
                            <div
                                class="flex items-center px-2 py-1 rounded-lg text-white w-fit"
                                :style="{ backgroundColor: KeywordColors[key] }"
                            >
                                {{ $t(key.toUpperCase()) }}
                                <span
                                    class="ml-2 cursor-pointer text-white"
                                    @click="removeKeys(index)"
                                >
                                    &times;
                                </span>
                            </div>
                        </template>

                        <select
                            class="h-10 font-bold flex-1 border rounded-lg"
                            @change="optionChange"
                        >
                            <option value="none">
                                {{ $t("KEYWORDS") }}
                            </option>
                            <option value="NoKeywords">
                                {{ $t("NOKEYWORDS") }}
                            </option>
                            <option
                                v-for="(key, index) in filteredKeywordList"
                                :key="index"
                                :value="key"
                            >
                                {{ $t(key.toUpperCase()) }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="w-full">
                    <button
                        @click="resetFilters"
                        class="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-red-400 hover:text-white transition h-fit"
                    >
                        {{ $t("RESET") }}
                    </button>
                </div>
            </div>
        </aside>

        <!-- 右侧卡牌列表 -->
        <main
            class="justify-items-center md:w-2/3 overflow-y-scroll md:h-[calc(100vh-68px)] customScroll"
        >
            <div
                class="grid p-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
            >
                <div
                    v-for="card in filteredCards"
                    :key="card.cardId"
                    class="bg-white shadow-md rounded-lg overflow-hidden max-w-[200px] h-fit"
                >
                    <img
                        :src="card.imgSrc"
                        :alt="card.name"
                        :onclick="() => routeTo(card.cardId)"
                        class="object-cover"
                    />
                </div>
            </div>

            <div
                ref="bottomElement"
                class="w-full h-10 col-span-full flex justify-center items-center"
            >
                <span
                    v-if="
                        currentPage === totalPages || filteredCards.length === 0
                    "
                    >{{ $t("END") }}</span
                >
            </div>
        </main>
    </div>
</template>
