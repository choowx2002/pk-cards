<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Runes, runeColorsCss, CardTypes } from "/src/constant.js";

const router = useRouter();
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
        cards.value = data.slice(0, 10);
    } catch (error) {
        console.error("Failed to load card data:", error);
    }
});

const filteredCards = computed(() => {
    return cards.value.filter((card) => {
        const matchesSearch = searchKey.value
            ? card.name.includes(searchKey.value) ||
              card.cardId.includes(searchKey.value)
            : true;
        const matchesRunes = selectedRunes.value.length
            ? withAnd.value
                ? card.runeColor.every((r) => selectedRunes.value.includes(r))
                : selectedRunes.value.some((r) => card.runeColor.includes(r))
            : true;
        const matchesTypes = selectedTypes.value.length
            ? selectedTypes.value.includes(card.type)
            : true;
        const matchesKeys = selectedKeys.value.length
            ? withAnd.value
                ? selectedKeys.value.every((k) =>
                      card.keywords.some((kw) => kw.name === k)
                  )
                : selectedKeys.value.some((k) =>
                      card.keywords.some((kw) => kw.name === k)
                  )
            : true;
        const matchesMight =
            (might.value.min === "" || card.might >= might.value.min) &&
            (might.value.max === "" || card.might <= might.value.max);
        const matchesEnergy =
            (energy.value.min === "" || card.cost.energy >= energy.value.min) &&
            (energy.value.max === "" || card.cost.energy <= energy.value.max);
        const matchesPower =
            (power.value.min === "" ||
                card.cost.power.count >= power.value.min) &&
            (power.value.max === "" ||
                card.cost.power.count <= power.value.max);
        return (
            matchesSearch &&
            matchesRunes &&
            matchesTypes &&
            matchesKeys &&
            matchesMight &&
            matchesEnergy &&
            matchesPower
        );
    });
});

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
</script>

<template>
    <div class="max-w-[1300px] mx-auto">
        <!-- 左侧筛选栏 -->
        <aside
            class="w-screen p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 justify-items-center gap-4"
        >
            <!-- name and id -->
            <div class="py-1 px-2">
                <label class="text-lg font-semibold"
                    >{{ $t("CARD NAME") }}/{{ $t("ID") }}:</label
                >
                <input
                    v-model="searchKey"
                    placeholder="卡牌名字/编号"
                    class="w-full px-2 py-1 border-b-3"
                />
            </div>

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
                            name=""
                            id=""
                            v-model="withAnd"
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
                                ? { background: runeColorsCss[rune] ?? 'black' }
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
                <label class="text-lg font-semibold">{{ $t("TYPE") }}:</label>
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
                            class="transition-transform p-2 ease-out hover:scale-110"
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
        </aside>

        <!-- 右侧卡牌列表 -->
        <main
            class="grid p-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center"
        >
            <div
                v-for="card in filteredCards"
                :key="card.cardId"
                class="bg-white shadow-md rounded-lg overflow-hidden max-w-[200px]"
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
