<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    Runes,
    runeColorsCss,
    CardTypes,
    KeywordList,
    KeywordColors,
} from "/src/constant.js";

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

onMounted(async () => {
    try {
        const response = await fetch("/src/assets/data/cards-cn.json");
        const data = await response.json();
        // cards.value = data.slice(0, 10);
        cards.value = data;
    } catch (error) {
        console.error("Failed to load card data:", error);
    }
    
    loadFiltersFromQuery();
});

const loadFiltersFromQuery = () => {
    const query = route.query;

    searchKey.value = query.searchKey || "";
    withAnd.value = query.withAnd === "true";
    showMore.value = query.showMore === "true";

    selectedRunes.value = query.selectedRunes ? query.selectedRunes.split(",") : [];
    selectedTypes.value = query.selectedTypes ? query.selectedTypes.split(",") : [];
    selectedKeys.value = query.selectedKeys ? query.selectedKeys.split(",") : [];

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

watch(
    [searchKey, selectedRunes, selectedTypes, selectedKeys, withAnd, might, energy, power],
    () => {
        updateQueryParams();
    },
    { deep: true }
);

const updateQueryParams = () => {
    router.push({
        path: route.path,
        query: {
            searchKey: searchKey.value || undefined,
            selectedRunes: selectedRunes.value.length ? selectedRunes.value.join(",") : undefined,
            selectedTypes: selectedTypes.value.length ? selectedTypes.value.join(",") : undefined,
            selectedKeys: selectedKeys.value.length ? selectedKeys.value.join(",") : undefined,
            withAnd: withAnd.value ? "true" : undefined,
            mightMin: might.value.min || undefined,
            mightMax: might.value.max || undefined,
            energyMin: energy.value.min || undefined,
            energyMax: energy.value.max || undefined,
            powerMin: power.value.min || undefined,
            powerMax: power.value.max || undefined,
            showMore: showMore.value ? "true" : undefined
        },
    });
};

const filteredCards = computed(() => {
    return cards.value.filter((card) => {
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
    return withAnd.value
        ? selectedKeys.value.every((k) =>
              card.keywords.some((kw) => kw.name === k)
          )
        : selectedKeys.value.some((k) =>
              card.keywords.some((kw) => kw.name === k)
          );
};

// Might filter
const matchesMight = (card) => {
    return (
        (might.value.min === "" || card.might >= might.value.min) &&
        (might.value.max === "" || card.might <= might.value.max)
    );
};

// Energy filter
const matchesEnergy = (card) => {
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
};

</script>

<template>
    <div class="max-w-[1300px] mx-auto">
        <!-- 左侧筛选栏 -->
        <aside class="w-full p-4 sticky top-1 z-50 bg-white shadow-md pt-3">
            <!-- name and id -->
            <div class="py-1 px-2">
                <div class="w-full">
                    <div class="flex justify-between items-center">
                        <label class="text-lg font-semibold"
                            >{{ $t("CARD NAME") }}/{{ $t("ID") }}:</label
                        >
                        <div
                            class="flex align-baseline gap-2 text-sm font-bold"
                        >
                            <span>{{ $t("MORE") }}</span>
                            <input
                                type="checkbox"
                                :checked="showMore"
                                @click="toogleShowMore"
                            />
                        </div>
                    </div>
                    <input
                        v-model="searchKey"
                        placeholder="卡牌名字/编号"
                        class="w-full px-2 py-1 border-b-2 focus:outline-0"
                    />
                </div>
            </div>
            <div
                class="w-full max-h-0 overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 justify-items-start gap-4 p-0"
                :class="showMore ? 'max-h-[1000px] p-4 box-border' : ''"
                style="transition: all 0.3s ease"
            >
                <!-- runes -->
                <div>
                    <div class="flex justify-between">
                        <label class="text-lg font-semibold"
                            >{{ $t("RUNE") }}:</label
                        >
                        <div>
                            <span>严格</span>
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
                                :src="`/src/assets/images/${rune.toUpperCase()}.webp`"
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
                                :src="`/src/assets/images/${type}.svg`"
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

                <div class="w-full text-end mt-4 md:col-span-3">
                    <button
                        @click="resetFilters"
                        class="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
                    >
                        {{ $t("RESET") }}
                    </button>
                </div>
            </div>
        </aside>

        <!-- 右侧卡牌列表 -->
        <main
            class="grid p-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 justify-items-center"
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
        </main>
    </div>
</template>
