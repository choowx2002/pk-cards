<template>
    <Notify ref="notifyRef" />
    <!-- 主体部分 -->
    <div
        class="flex flex-1 overflow-hidden max-w-screen-2xl mx-auto"
        style="height: calc(100vh - 60px)"
        @mousemove="updateTooltipPosition"
        ref="deckBuilder"
    >
        <!-- 卡牌选择区 -->
        <aside
            class="w-1/2 md:w-3/5 bg-gray-100 customScroll overflow-scroll"
            :class="[showCardList ? 'max-w-[5000px]' : 'max-w-fit']"
        >
            <h2 class="mb-2 flex justify-between items-center w-full sm:relative z-50">
                <div
                    class="flex gap-2 pl-4 items-center w-full"
                    v-if="showCardList"
                >
                    <!-- filter area -->
                    <div class="w-full">
                        <!-- search key -->
                        <div class="w-full py-1 flex items-center">
                            <input
                                v-model="searchKey"
                                :placeholder="`${$t('CARD NAME')}/${$t('ID')}`"
                                class="w-full border-b-2 focus:outline-0 text-black"
                            />
                            <div
                                class="rounded p-1 ml-1 border"
                                :class="showFilter ? 'bg-teal-700' : 'border-0'"
                            >
                                <Filter
                                    :size="18"
                                    @click="toogleFilter"
                                    :class="showFilter ? 'text-white' : ''"
                                />
                            </div>
                            <ChevronsLeft
                                v-if="showCardList"
                                class="mx-1"
                                :stroke-width="1.5"
                                @click="toogleCartList"
                            />
                        </div>

                        <!-- backdrop -->
                        <div
                            v-if="showFilter"
                            class="absolute sm:hidden top-0 left-0 w-screen h-screen bg-black opacity-50 z-40"
                            @click="toogleFilter"
                        ></div>
                        <!-- filter options -->
                        <div
                            v-if="showFilter"
                            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] bg-gray-100 z-50 py-3 px-4 sm:static sm:z-10 sm:translate-0 sm:w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 rounded-md sm:px-2 sm:py-1"
                        >
                            <div class="col-span-full sm:hidden">
                                <div class="flex flex-wrap">
                                    <div
                                        v-for="(tag, index) in tags"
                                        :key="tag"
                                        class=""
                                    >
                                        <div
                                            v-if="tag.type === 'rune'"
                                            class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                        >
                                            <img
                                                :src="`${base}/assets/images/${tag.name.toUpperCase()}.webp`"
                                                :alt="tag.type"
                                                class="w-5 h-5 mr-2 scale-125"
                                            />
                                            <span>{{
                                                $t(tag.name.toUpperCase())
                                            }}</span>
                                            <span
                                                class="ml-2 cursor-pointer text-black"
                                                @click="removeTag(index)"
                                            >
                                                &times;
                                            </span>
                                        </div>
                                        <div
                                            v-else-if="tag.type === 'type'"
                                            class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                        >
                                            <img
                                                :src="`${base}/assets/images/${tag.name.toLowerCase()}.svg`"
                                                :alt="tag.type"
                                                class="w-5 h-5 mr-2"
                                            />
                                            <span>{{
                                                $t(tag.name.toUpperCase())
                                            }}</span>
                                            <span
                                                class="ml-2 cursor-pointer text-black"
                                                @click="removeTag(index)"
                                            >
                                                &times;
                                            </span>
                                        </div>
                                        <div
                                            v-else-if="
                                                [
                                                    'energy',
                                                    'power',
                                                    'might',
                                                ].includes(tag.type)
                                            "
                                            class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                        >
                                            <img
                                                v-if="tag.type === 'energy'"
                                                :src="`${base}/assets/images/energy-${tag.name}.svg`"
                                                :alt="tag.type"
                                                class="w-5 h-5 mr-2"
                                            />
                                            <img
                                                v-else-if="tag.type === 'might'"
                                                :src="`${base}/assets/images/might.svg`"
                                                :alt="tag.type"
                                                class="w-5 h-5 mr-2"
                                            />
                                            <span v-else
                                                >{{
                                                    $t(tag.type.toUpperCase())
                                                }}:
                                            </span>
                                            <span> {{ tag.name }}</span>
                                            <span
                                                class="ml-2 cursor-pointer text-black"
                                                @click="removeTag(index)"
                                            >
                                                &times;
                                            </span>
                                        </div>
                                        <div
                                            v-else-if="tag.type === 'keyword'"
                                            class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center text-white"
                                            :style="`background: ${
                                                KeywordColors[tag.name]
                                            }`"
                                        >
                                            <span class="mr-2">
                                                {{ $t(tag.name.toUpperCase()) }}
                                            </span>
                                            <span
                                                class="cursor-pointer text-white"
                                                @click="removeTag(index)"
                                            >
                                                &times;
                                            </span>
                                        </div>
                                        <div
                                            v-else-if="tag.type === 'series'"
                                            class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                        >
                                            <span class="mr-2">
                                                {{ $t(tag.name.toUpperCase()) }}
                                            </span>
                                            <span
                                                class="cursor-pointer"
                                                @click="removeTag(index)"
                                            >
                                                &times;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Series -->
                            <div class="mb-2">
                                <label>{{ $t("SERIES") }}: </label>
                                <Listbox v-model="selectedSeries">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm"
                                    >
                                        {{
                                            selectedSeries === "ALL"
                                                ? $t("ALL")
                                                : selectedSeries
                                        }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="s in Series"
                                            :key="s"
                                            :value="s"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                :class="[
                                                    'px-3 py-2 cursor-pointer',
                                                    active ? 'bg-blue-100' : '',
                                                    selected
                                                        ? 'font-bold '
                                                        : '',
                                                ]"
                                            >
                                                {{ s }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                            <!-- Card Type -->
                            <div class="mb-2">
                                <label>{{ $t("TYPE") }}: </label>
                                <Listbox v-model="selectedType">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm justify-center items-center flex"
                                    >
                                        <img
                                            v-if="selectedType !== 'ALL'"
                                            :src="`${base}/assets/images/${selectedType.toLowerCase()}.svg`"
                                            :alt="selectedType"
                                            class="h-5 w-5 p-0.5 mr-1"
                                        />
                                        {{ $t(selectedType.toUpperCase()) }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="t in CardTypes.filter(
                                                (t) => t !== 'Rune'
                                            )"
                                            :key="t"
                                            :value="t"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                class="flex items-center px-3 py-2 cursor-pointer"
                                                :class="[
                                                    active ? 'bg-blue-100' : '',
                                                    selected
                                                        ? 'font-bold '
                                                        : '',
                                                ]"
                                            >
                                                <img
                                                    :src="`${base}/assets/images/${t.toLowerCase()}.svg`"
                                                    :alt="t"
                                                    class="w-5 h-5 mr-2"
                                                />
                                                {{ $t(t.toUpperCase()) }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <!-- Rune -->
                            <div class="mb-2">
                                <label>{{ $t("RUNE") }}: </label>
                                <Listbox v-model="selectedRune">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm flex justify-center items-center"
                                    >
                                        <img
                                            v-if="selectedRune !== 'ALL'"
                                            :src="`${base}/assets/images/${selectedRune.toUpperCase()}.webp`"
                                            :alt="selectedRune"
                                            class="h-6 w-6"
                                        />
                                        {{ $t(selectedRune.toUpperCase()) }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="r in Runes"
                                            :key="r"
                                            :value="r"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                :class="[
                                                    'px-3 py-2 cursor-pointer flex items-center',
                                                    active ? 'bg-blue-100' : '',
                                                    selected ? 'font-bold' : '',
                                                ]"
                                            >
                                                <img
                                                    :src="`${base}/assets/images/${r.toUpperCase()}.webp`"
                                                    :alt="r"
                                                    class="w-5 h-5 mr-2"
                                                />
                                                {{ $t(r.toUpperCase()) }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <!-- Energy Cost -->
                            <div class="mb-2">
                                <label>{{ $t("ENERGY") }}: </label>
                                <Listbox v-model="selectedEnergy">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm"
                                    >
                                        {{
                                            selectedEnergy === "ALL"
                                                ? $t("ALL")
                                                : selectedEnergy
                                        }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="n in energyOptions"
                                            :key="n"
                                            :value="n"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                :class="[
                                                    'px-3 py-2 cursor-pointer',
                                                    active ? 'bg-blue-100' : '',
                                                    selected
                                                        ? 'font-bold '
                                                        : '',
                                                ]"
                                            >
                                                {{ n }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <!-- Power Cost -->
                            <div class="mb-2">
                                <label>{{ $t("POWER") }}: </label>
                                <Listbox v-model="selectedPower">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm"
                                    >
                                        {{
                                            selectedPower === "ALL"
                                                ? $t("ALL")
                                                : selectedPower
                                        }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="n in powerOptions"
                                            :key="n"
                                            :value="n"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                :class="[
                                                    'px-3 py-2 cursor-pointer',
                                                    active ? 'bg-blue-100' : '',
                                                    selected
                                                        ? 'font-bold '
                                                        : '',
                                                ]"
                                            >
                                                {{ n }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <!-- Might Cost -->
                            <div class="mb-2">
                                <label>{{ $t("MIGHT") }}: </label>
                                <Listbox v-model="selectedMight">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm"
                                    >
                                        {{
                                            selectedMight === "ALL"
                                                ? $t("ALL")
                                                : selectedMight
                                        }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="n in mightOptions"
                                            :key="n"
                                            :value="n"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                :class="[
                                                    'px-3 py-2 cursor-pointer',
                                                    active ? 'bg-blue-100' : '',
                                                    selected
                                                        ? 'font-bold '
                                                        : '',
                                                ]"
                                            >
                                                {{ n }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>

                            <!-- Keyword -->
                            <div class="mb-2">
                                <label>{{ $t("KEYWORD") }}: </label>
                                <Listbox v-model="selectedKeyword">
                                    <ListboxButton
                                        class="w-full px-1 py-0.5 border rounded bg-white shadow-sm text-sm"
                                    >
                                        {{ $t(selectedKeyword.toUpperCase()) }}
                                    </ListboxButton>
                                    <ListboxOptions
                                        class="absolute bg-white border rounded shadow-md z-50 min-w-[20vw] lg:min-w-fit customScroll max-h-62 overflow-y-auto"
                                    >
                                        <ListboxOption
                                            v-for="k in KeywordList"
                                            :key="k"
                                            :value="k"
                                            as="template"
                                            v-slot="{ active, selected }"
                                        >
                                            <li
                                                :class="[
                                                    'px-3 py-2 cursor-pointer',
                                                    active ? 'bg-blue-100' : '',
                                                    selected
                                                        ? 'font-bold '
                                                        : '',
                                                ]"
                                            >
                                                {{ $t(k.toUpperCase()) }}
                                            </li>
                                        </ListboxOption>
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        </div>

                        <!-- filter tag -->
                        <div class="w-full py-1">
                            <div class="flex flex-wrap">
                                <div
                                    v-for="(tag, index) in tags"
                                    :key="tag"
                                    class=""
                                >
                                    <div
                                        v-if="tag.type === 'rune'"
                                        class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                    >
                                        <img
                                            :src="`${base}/assets/images/${tag.name.toUpperCase()}.webp`"
                                            :alt="tag.type"
                                            class="w-5 h-5 mr-2 scale-125"
                                        />
                                        <span>{{
                                            $t(tag.name.toUpperCase())
                                        }}</span>
                                        <span
                                            class="ml-2 cursor-pointer text-black"
                                            @click="removeTag(index)"
                                        >
                                            &times;
                                        </span>
                                    </div>
                                    <div
                                        v-else-if="tag.type === 'type'"
                                        class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                    >
                                        <img
                                            :src="`${base}/assets/images/${tag.name.toLowerCase()}.svg`"
                                            :alt="tag.type"
                                            class="w-5 h-5 mr-2"
                                        />
                                        <span>{{
                                            $t(tag.name.toUpperCase())
                                        }}</span>
                                        <span
                                            class="ml-2 cursor-pointer text-black"
                                            @click="removeTag(index)"
                                        >
                                            &times;
                                        </span>
                                    </div>
                                    <div
                                        v-else-if="
                                            [
                                                'energy',
                                                'power',
                                                'might',
                                            ].includes(tag.type)
                                        "
                                        class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                    >
                                        <img
                                            v-if="tag.type === 'energy'"
                                            :src="`${base}/assets/images/energy-${tag.name}.svg`"
                                            :alt="tag.type"
                                            class="w-5 h-5 mr-2"
                                        />
                                        <img
                                            v-else-if="tag.type === 'might'"
                                            :src="`${base}/assets/images/might.svg`"
                                            :alt="tag.type"
                                            class="w-5 h-5 mr-2"
                                        />
                                        <span v-else
                                            >{{ $t(tag.type.toUpperCase()) }}:
                                        </span>
                                        <span> {{ tag.name }}</span>
                                        <span
                                            class="ml-2 cursor-pointer text-black"
                                            @click="removeTag(index)"
                                        >
                                            &times;
                                        </span>
                                    </div>
                                    <div
                                        v-else-if="tag.type === 'keyword'"
                                        class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center text-white"
                                        :style="`background: ${
                                            KeywordColors[tag.name]
                                        }`"
                                    >
                                        <span class="mr-2">
                                            {{ $t(tag.name.toUpperCase()) }}
                                        </span>
                                        <span
                                            class="cursor-pointer text-white"
                                            @click="removeTag(index)"
                                        >
                                            &times;
                                        </span>
                                    </div>
                                    <div
                                        v-else-if="tag.type === 'series'"
                                        class="px-2 py-1 bg-gray-200 rounded-full text-sm mr-2 mb-2 flex items-center"
                                    >
                                        <span class="mr-2">
                                            {{ $t(tag.name.toUpperCase()) }}
                                        </span>
                                        <span
                                            class="cursor-pointer"
                                            @click="removeTag(index)"
                                        >
                                            &times;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ChevronsRight
                    v-if="!showCardList"
                    class="mx-1"
                    :stroke-width="1.5"
                    @click="toogleCartList"
                />
            </h2>

            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mx-2"
                :class="[showCardList ? '' : 'hidden']"
            >
                <div
                    v-for="card in filteredCards"
                    :key="card.cardId"
                    class="bg-white relative z-20 shadow-md rounded pb-2 overflow-hidden px-0.5 cursor-pointer hover:scale-105 active:animate-pulse ease-in-out"
                    style="transition-duration: 50ms"
                    @mouseenter="showTooltip(card)"
                    @mouseleave="hideTooltip"
                    @click="addToDeck(card)"
                >
                    <div class="absolute right-0 top-0 p-0.5" style="background-color: rgba(0, 0, 0, 0.5);">
                        <ExternalLink class="text-white" :size="16" @click="routeToCardDetails(card.cardId)"/>
                    </div>
                    <img
                        :src="card.imgSrc"
                        :alt="card.name"
                        class="w-full lg:max-w-[150px] mx-auto object-cover rounded object-left-top"
                    />
                    <p class="text-center mt-1 text-sm">
                        {{ card.name }}
                    </p>
                </div>
                <div
                    ref="bottomElement"
                    class="w-full h-10 col-span-full flex justify-center items-center"
                >
                    <span
                        v-if="
                            currentPage === totalPages ||
                            filteredCards.length === 0
                        "
                        >{{ $t("END") }}</span
                    >
                </div>
            </div>
        </aside>

        <!-- 卡组构建区 -->
        <section
            class="px-4 border-l-2 customScroll overflow-scroll"
            :class="[!showCardList ? 'w-full' : 'w-1/2 md:w-2/5']"
        >
            <div
                class="text-lg font-semibold mb-2 flex items-center justify-between gap-2 flex-wrap"
            >
                <div class="items-center flex">
                    <h2>卡组</h2>
                    <button
                        class="text-xs flex sm:hidden p-1 rounded items-center gap-0.5"
                        @click="copy"
                    >
                        {{ $t("COPY") }}{{ $t("TEXT") }} <Copy :size="12" />
                    </button>
                </div>

                <div class="mr-auto active:scale-75" title="点击查看构筑信息" @click="showStatus = !showStatus">
                    <Info class="text-teal-700" :size="16"/>
                </div>
                

                <div
                    class="flex justify-center items-center overflow-hidden rounded-md border-1 border-gray-700"
                >
                    <div
                        @click="showCardImg = false"
                        class="p-1"
                        :class="[!showCardImg ? 'bg-teal-700' : 'opacity-50']"
                    >
                        <List
                            :class="[!showCardImg ? 'text-white' : '']"
                            :size="16"
                        />
                    </div>
                    <div
                        @click="showCardImg = true"
                        class="p-1"
                        :class="[showCardImg ? 'bg-teal-700' : 'opacity-50']"
                    >
                        <LayoutGrid
                            :class="[showCardImg ? 'text-white' : 'text-black']"
                            :size="16"
                        />
                    </div>
                </div>
                <div class="w-full items-center hidden sm:flex">
                    <button
                        class="text-xs hidden sm:flex p-1 rounded items-center gap-0.5 bg-gray-200"
                        @click="copy"
                    >
                        {{ $t("COPY") }}{{ $t("TEXT") }} <Copy :size="12" />
                    </button>
                </div>
            </div>

            <div id="deck" class="pb-3 overflow-y-scroll customScroll">
                <div
                    class="xl:flex gap-2"
                    :class="[
                        showCardImg ? 'xl:w-fit' : '',
                        showCardList ? '' : 'md:w-fit sm:flex',
                    ]"
                >
                    <!-- legend -->
                    <fieldset
                        class="border-1 px-2 py-1.5 rounded-md min-h-28"
                        :class="[!selectedDeck.legend ? 'h-28' : 'h-full']"
                    >
                        <legend class="text-md font-semibold">
                            {{ $t("LEGEND") }}
                        </legend>

                        <div
                            v-if="selectedDeck.legend"
                            @mouseenter="showTooltip(selectedDeck.legend)"
                            @mouseleave="hideTooltip"
                            @click="selectedDeck.legend = null"
                        >
                            <div v-if="!showCardImg">
                                <p class="text-xs">
                                    {{ selectedDeck.legend.cardId }}
                                </p>
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
                                    class="max-w-[150px] mx-auto"
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
                        v-if="selectedDeck.legend"
                        :class="[
                            !showCardImg ? 'h-full' : 'h-full min-h-28',
                            !showCardImg && !showCardList ? 'sm:min-h-28' : '',
                        ]"
                    >
                        <legend class="text-md font-semibold">
                            {{ $t("RUNE") }}（{{ totalCount }}/12）
                        </legend>
                        <div
                            class="gap-2"
                            :class="[
                                showCardImg
                                    ? 'grid grid-cols-1 sm:grid-cols-2'
                                    : '',
                                !showCardList ? 'grid sm:grid-cols-1' : '',
                                !showCardImg && !showCardList ? 'xl:block' : '',
                                showCardImg && !showCardList
                                    ? 'grid grid-cols-2'
                                    : '',
                            ]"
                        >
                            <div
                                v-for="(r, index) in selectedDeck.runes"
                                :key="r"
                            >
                                <div
                                    class="h-full items-center bg-white"
                                    :class="[
                                        !showCardImg
                                            ? 'flex w-full justify-between items-center rounded-4xl shadow-md mb-2 px-2'
                                            : '',
                                    ]"
                                >
                                    <div
                                        v-if="!showCardImg"
                                        class="flex items-center mr-3"
                                    >
                                        <img
                                            :src="getRuneImageUrl(r.rune)"
                                            :alt="r.rune"
                                            :title="r.rune"
                                            width="32px"
                                        />
                                        <span>{{
                                            $t(r.rune.toUpperCase())
                                        }}</span>
                                    </div>

                                    <img
                                        v-if="showCardImg"
                                        @mouseenter="showTooltip(r)"
                                        @mouseleave="hideTooltip"
                                        :src="r.imgSrc"
                                        :alt="r.rune"
                                        class="max-w-[150px] mx-auto"
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
                    </fieldset>
                </div>

                <!-- units -->
                <fieldset class="border-1 px-2 py-1.5 rounded-md">
                    <legend class="text-md font-semibold">
                        {{ $t("UNIT") }}（{{ totalCard }}/40）
                    </legend>
                    <div
                        v-if="selectedDeck.units.length > 0"
                        class="grid"
                        :class="[
                            !showCardList
                                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
                                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
                        ]"
                    >
                        <div
                            v-for="(card, index) in selectedDeck.units"
                            :key="card.cardId"
                            class="gap-2 mb-2 cursor-pointer mx-1"
                            @mouseenter="showTooltip(card)"
                            @mouseleave="hideTooltip"
                            @click="removeFromDeck(index, 'card')"
                        >
                            <div class="rounded-md px-1 shadow-md bg-white">
                                <div
                                    class="max-w-[150px] w-full mx-auto my-1.5 rounded-md overflow-hidden"
                                >
                                    <img
                                        v-if="showCardImg"
                                        :src="card.imgSrc"
                                        :alt="card.name"
                                    />
                                </div>

                                <div
                                    class="w-full flex justify-between items-center font-semibold"
                                >
                                    <span class="text-sm truncate w-[80%]">{{
                                        card.name
                                    }}</span>
                                    <span>x{{ card.count }}</span>
                                </div>
                                <p class="text-[10px]">
                                    {{ card.cardId }}
                                </p>
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
                            v-for="(card, index) in selectedDeck.battlefield"
                            :key="card.cardId"
                            class="gap-2 mb-2 cursor-pointer mx-1"
                            @mouseenter="showTooltip(card)"
                            @mouseleave="hideTooltip"
                            @click="removeFromDeck(index, 'bf')"
                        >
                            <div class="rounded-md px-1 shadow-md bg-white">
                                <div class="w-full font-semibold">
                                    <img
                                        v-if="showCardImg"
                                        :src="card.imgSrc"
                                        :alt="card.name"
                                        class="max-h-[150px] mx-auto"
                                    />
                                    <span class="text-sm truncate w-full">{{
                                        card.name
                                    }}</span>
                                </div>
                                <p class="text-[10px]">
                                    {{ card.cardId }}
                                </p>
                            </div>
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
        class="fixed p-2 bg-gray-200 text-black text-sm rounded shadow-lg max-w-52 min-w-40 z-60"
        :style="{
            top: tooltipPosition.y + 'px',
            left: tooltipPosition.x + 'px',
        }"
    >
        <!-- <img
            v-if="!showCardImg"
            :src="tooltipCard.imgSrc"
            alt=""
            class="mx-auto max-w-[100px] rounded-md"
        /> -->
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
                <img :src="base + 'assets/images/rune.svg'" width="12" alt="" />
                <span>:{{ tooltipCard.cost.power.count }}</span>
            </div>
        </div>
        <div
            class="whitespace-pre-wrap mb-1 py-2 px-1 border-y-2"
            v-html="replaceKeywords(tooltipCard?.description)"
        />
    </div>

    <!-- <footer class="p-4 bg-gray-200 flex justify-between">
        <button class="text-sm bg-red-500 px-3 py-1 rounded" @click="clearDeck">
            清除所有
        </button>
        <div class="flex mr-auto ml-1">
            <label>显示小卡片</label>
            <input
                type="checkbox"
                :checked="canShowTooltips"
                @click="toogleShow"
            />
        </div>
    </footer> -->
    <DraggableDiv
        v-if="showStatus"
        class="z-100"
        :initialPosition="{ x: 200, y: 150 }"
        @close="showStatus = false"
        :data="{
            ...deckDescription,
            legendChampionPresent: selectedDeck.legend_champion_present,
        }"
    />
</template>

<script setup>
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
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
    Series,
} from "/src/constant.js";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";
import { Copy } from "lucide-vue-next";
import { Filter } from "lucide-vue-next";
import { ExternalLink } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { Info } from "lucide-vue-next";

const router = useRouter();
const base = import.meta.env.BASE_URL;
const showCardList = ref(true);
const showCardImg = ref(false);
const canShowTooltips = ref(false);
const runesImage = ref([]);
const notifyRef = ref(null);
const deckBuilder = ref(null);
const tooltip = ref(null);

// filter
const showStatus = ref(false);
const searchKey = ref("");
const currentPage = ref(1);
const cardsPerPage = ref(20);
const observer = ref(null);
const bottomElement = ref(null);
const totalPages = ref(0);
const showFilter = ref(false);
const energyOptions = ref([
    "ALL",
    ...Array.from({ length: 12 }, (_, i) => i + 1),
]);
const powerOptions = ref(["ALL", 1, 2, 3]);
const mightOptions = ref([
    "ALL",
    ...Array.from({ length: 12 }, (_, i) => i + 1),
]);
const selectedKeyword = ref("ALL");
const selectedType = ref("ALL");
const selectedRune = ref("ALL");
const selectedEnergy = ref("ALL");
const selectedPower = ref("ALL");
const selectedMight = ref("ALL");
const selectedSeries = ref("ALL");

const tags = computed(() => {
    const t = [];
    if (selectedType.value !== "ALL") {
        t.push({ name: selectedType.value, type: "type" });
    }
    if (selectedRune.value !== "ALL") {
        t.push({ name: selectedRune.value, type: "rune" });
    }
    if (selectedEnergy.value !== "ALL") {
        t.push({ name: selectedEnergy.value, type: "energy" });
    }
    if (selectedPower.value !== "ALL") {
        t.push({ name: selectedPower.value, type: "power" });
    }
    if (selectedMight.value !== "ALL") {
        t.push({ name: selectedMight.value, type: "might" });
    }
    if (selectedKeyword.value !== "ALL") {
        t.push({ name: selectedKeyword.value, type: "keyword" });
    }
    if (selectedSeries.value !== "ALL") {
        t.push({ name: selectedSeries.value, type: "series" });
    }
    return t;
});
// remove tag
const removeTag = (index) => {
    const tag = tags.value[index];
    switch (tag.type) {
        case "type":
            selectedType.value = "ALL";
            break;
        case "rune":
            selectedRune.value = "ALL";
            break;
        case "energy":
            selectedEnergy.value = "ALL";
            break;
        case "power":
            selectedPower.value = "ALL";
            break;
        case "might":
            selectedMight.value = "ALL";
            break;
        case "keyword":
            selectedKeyword.value = "ALL";
            break;
        case "series":
            selectedSeries.value = "ALL";
            break;
    }
};

// toogle filter
const toogleFilter = () => {
    showFilter.value = !showFilter.value;
};

//-----------------------end filter-------------------------

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
    setupObserver();
});

onUnmounted(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
});

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

const availableCards = ref([]);

const filteredCards = computed(() => {
    try {
        const filtered = availableCards.value.filter((card) => {
            return (
                (searchKey.value === "" ||
                    card.cardId.includes(searchKey.value) ||
                    card.name.includes(searchKey.value)) &&
                (selectedKeyword.value === "ALL" ||
                    card.keywords
                        .map((k) => k.name)
                        .includes(selectedKeyword.value)) &&
                (selectedType.value === "ALL" ||
                    card.type === selectedType.value) &&
                (selectedRune.value === "ALL" ||
                    (card?.runeColor &&
                        card.runeColor.includes(selectedRune.value))) &&
                (selectedEnergy.value === "ALL" ||
                    card?.cost?.energy === parseInt(selectedEnergy.value)) &&
                (selectedPower.value === "ALL" ||
                    card?.cost?.power.count ===
                        parseInt(selectedPower.value)) &&
                (selectedMight.value === "ALL" ||
                    card?.might === parseInt(selectedMight.value)) &&
                (selectedSeries.value === "ALL" ||
                    card?.cardId.startsWith(selectedSeries.value))
            );
        });
        totalPages.value = Math.ceil(filtered.length / cardsPerPage.value);
        const startIndex = 0;
        const endIndex = currentPage.value * cardsPerPage.value;
        return filtered.slice(startIndex, endIndex);
    } catch (error) {
        console.log(error);
    }
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
    total: 0,
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
                        if (!desc.energydistributed[unit.cost.energy]) {
                            desc.energydistributed[unit.cost.energy] = {};
                        }
                        desc.energydistributed[unit.cost.energy][unit.runeColor[0]] =
                        (desc.energydistributed[unit.cost.energy][unit.runeColor[0]] || 0) + unit.count;
                    }

                    // Update power distribution
                    if (unit?.cost?.power.count) {
                        if (!desc.powerdistributed[unit.cost.power.count]) {
                            desc.powerdistributed[unit.cost.power.count] = {};
                        }
                        desc.powerdistributed[unit.cost.power.count][unit.runeColor[0]] =
                        (desc.powerdistributed[unit.cost.power.count][unit.runeColor[0]] || 0) + unit.count;
                    }

                    // Update might distribution
                    if (unit.might) {
                        if (!desc.mightdistributed[unit.might]) {
                            desc.mightdistributed[unit.might] = {};
                        }
                        desc.mightdistributed[unit.might][unit.runeColor[0]] =
                        (desc.mightdistributed[unit.might][unit.runeColor[0]] || 0) + unit.count;
                    }

                    // Update rune distribution
                    if (unit.runeColor.length > 0) {
                        unit.runeColor.forEach((rune) => {
                            desc.runedistributed[rune] =
                                (desc.runedistributed[rune] || 0) + unit.count;
                        });
                    }

                    desc.total+=unit.count;
                    return desc;
                },
                {
                    unitsTypes: {},
                    energydistributed: {},
                    powerdistributed: {},
                    mightdistributed: {},
                    runedistributed: {},
                    total: 0,
                }
            );
        } else {
            deckDescription.value = {
                unitsTypes: {},
                energydistributed: {},
                powerdistributed: {},
                mightdistributed: {},
                runedistributed: {},
                total: 0
            };
        }
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
    const isMobile = () => {
        return (
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) || window.innerWidth <= 768
        );
    };

    if (isMobile()) return;
 
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

    requestAnimationFrame(() => {
        tooltipPosition.value = {
            x:
                x + tooltipWidth > containerWidth
                    ? x - tooltipWidth - 5
                    : x + 10,
            y:
                y + tooltipHeight > containerHeight
                    ? y - tooltipHeight - 5
                    : y + 10,
        };
    });
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
            if (isOverLimit(card.name, card.title)) {
                notifyRef.value?.addNotification(
                    `"${card.name}"在卡组里的数量已达到上限。`,
                    "info"
                );
                break;
            } else if (index === -1) {
                sDeck.units.push({ ...card, count: 1 });
            } else {
                sDeck.units[index].count++;
            }
            break;
        }
    }
};

const isOverLimit = (name, title) => {
    let count = 0;

    selectedDeck.value.units.forEach((u) => {
        if (
            u.name.trim() === name.trim() &&
            (!title ? true : u.title.trim() === title)
        )
            count += u.count;
    });
    return count >= 3;
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

const resetFilters = () => {
    searchKey.value = "";
    selectedType.value = "ALL";
    selectedRune.value = "ALL";
    selectedEnergy.value = "ALL";
    selectedPower.value = "ALL";
    selectedMight.value = "ALL";
    selectedKeyword.value = "ALL";
    selectedSeries.value = "ALL";
};

const copy = () => {
    const deckList = [];

    if (selectedDeck.value.legend) {
        deckList.push(`1x${selectedDeck.value.legend.cardId}`);
    }

    selectedDeck.value.runes.forEach((r) => {
        deckList.push(`${r.count}x${r.cardId}`);
    });

    selectedDeck.value.battlefield.forEach((b) => {
        deckList.push(`1x${b.cardId}`);
    });

    selectedDeck.value.units.forEach((u) => {
        deckList.push(`${u.count}x${u.cardId}`);
    });

    const formattedText = deckList.join("\n");

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
const routeToCardDetails = (id) => {
  const url = router.resolve({ path: "/card", query: { cardId: encodeURIComponent(id) } }).href;
  window.open(url, "_blank");
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
