<template>
    <div
        ref="draggable"
        class="absolute min-w-24 min-h-12 bg-gray-200 border-2 px-3 pb-3 rounded-lg shadow-lg"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
    >
        <div
            class="w-full flex justify-center relative active:cursor-grabbing"
            @mousedown="startDrag"
        >
            <GripHorizontalIcon />
            <X class="absolute right-0" @click="close" />
            <div class="absolute left-0">{{ data?.total ?? 0 }}/40</div>
        </div>
        <!-- <div class="w-full h-full py-2">
            {{ data }}
        </div> -->
        <div class="flex gap-3">
            <div class="flex w-1/2 gap-2 px-1 mb-1 bg-gray-200 border rounded">
                <div
                    v-for="(count, type) in data.unitsTypes"
                    class="flex items-center"
                    :key="type"
                >
                    <img
                        :src="`${base}/assets/images/${type.toLowerCase()}.svg`"
                        :alt="type"
                        class="w-5 h-5 mr-1"
                    />
                    {{ count }}
                </div>
            </div>
            <div class="flex w-1/2 gap-2 px-1 mb-1 bg-gray-200 border rounded">
                <div
                    v-for="(count, rune) in data.runedistributed"
                    class="flex items-center"
                    :key="rune"
                >
                    <img
                        :src="`${base}/assets/images/${rune.toUpperCase()}.webp`"
                        :alt="rune"
                        class="w-6 h-6 mr-1"
                    />
                    {{ count }}
                </div>
            </div>
        </div>

        <div class="flex flex-nowrap gap-3">
            <div class="px-1 mb-1 bg-gray-200 border rounded">
                <p class="w-full">{{ $t("ENERGY") }}</p>
                <div class="w-full flex flex-nowrap justify-center gap-0.5">
                    <div
                        v-for="energy in 12"
                        :key="energy"
                        class="flex items-center mb-1 flex-col"
                    >
                        <span class="text-center">{{
                            Object.values(
                                data.energydistributed[energy] || {}
                            ).reduce((sum, count) => sum + count, 0)
                        }}</span>
                        <div
                            class="h-[80px] w-4 border rounded flex flex-col-reverse overflow-hidden"
                        >
                            <template v-if="data.energydistributed[energy]">
                                <div
                                    v-for="(count, color) in data
                                        .energydistributed[energy]"
                                    :key="color"
                                    class="w-full outline-1"
                                    :style="{
                                        background: runeColorsCss[color],
                                        height: getHeight(
                                            count,
                                            maxEnergyCount
                                        ),
                                    }"
                                ></div>
                            </template>
                        </div>
                        <span class="text-center">{{ energy }}</span>
                    </div>
                </div>
            </div>
            <div class="px-1 mb-1 bg-gray-200 border rounded">
                <p class="w-full">{{ $t("POWER") }}</p>
                <div class="w-full flex flex-nowrap justify-center gap-0.5">
                    <div
                        v-for="power in (Object.keys(data.powerdistributed).at(
                            -1
                        ) ?? 3) * 1"
                        :key="power"
                        class="flex items-center mb-1 flex-col"
                    >
                        <span class="text-center">{{
                            Object.values(
                                data.powerdistributed[power] || {}
                            ).reduce((sum, count) => sum + count, 0)
                        }}</span>
                        <div
                            class="h-[80px] w-4 border rounded flex flex-col-reverse overflow-hidden"
                        >
                            <template v-if="data.powerdistributed[power]">
                                <div
                                    v-for="(count, color) in data
                                        .powerdistributed[power]"
                                    :key="color"
                                    class="w-full outline-1"
                                    :style="{
                                        background: runeColorsCss[color],
                                        height: getHeight(count, maxPowerCount),
                                    }"
                                ></div>
                            </template>
                        </div>
                        <span class="text-center">{{ power }}</span>
                    </div>
                </div>
            </div>
            <div class="px-1 mb-1 bg-gray-200 border rounded">
                <p class="w-full">{{ $t("MIGHT") }}</p>
                <div class="w-full flex flex-nowrap justify-center gap-0.5">
                    <div
                        v-for="might in (Object.keys(data.mightdistributed).at(
                            -1
                        ) ?? 12) * 1"
                        :key="might"
                        class="flex items-center mb-1 flex-col"
                    >
                        <span class="text-center">{{
                            Object.values(
                                data.mightdistributed[might] || {}
                            ).reduce((sum, count) => sum + count, 0)
                        }}</span>
                        <div
                            class="h-[80px] w-4 border rounded flex flex-col-reverse overflow-hidden"
                        >
                            <template v-if="data.mightdistributed[might]">
                                <div
                                    v-for="(count, color) in data
                                        .mightdistributed[might]"
                                    :key="color"
                                    class="w-full outline-1"
                                    :style="{
                                        background: runeColorsCss[color],
                                        height: getHeight(count, maxMightCount),
                                    }"
                                ></div>
                            </template>
                        </div>
                        <span class="text-center">{{ might }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { GripHorizontalIcon } from "lucide-vue-next";
import { ref, defineProps, computed, defineEmits } from "vue";
import { runeColorsCss } from "/src/constant.js";
import { X } from "lucide-vue-next";
const props = defineProps({
    initialPosition: {
        type: Object,
        default: () => ({ x: 100, y: 100 }),
    },
    data: {
        type: Object,
        default: () => ({}),
    },
});
const base = import.meta.env.BASE_URL;
const emits = defineEmits(["close"]);
const close = () => {
    emits("close");
};

const maxEnergyCount = computed(() => {
    return Math.max(
        1,
        ...Object.values(props.data.energydistributed || {}).map((colors) =>
            Object.values(colors).reduce((sum, count) => sum + count, 0)
        )
    );
});

const maxPowerCount = computed(() => {
    return Math.max(
        1,
        ...Object.values(props.data.powerdistributed || {}).map((colors) =>
            Object.values(colors).reduce((sum, count) => sum + count, 0)
        )
    );
});

const maxMightCount = computed(() => {
    return Math.max(
        1,
        ...Object.values(props.data.mightdistributed || {}).map((colors) =>
            Object.values(colors).reduce((sum, count) => sum + count, 0)
        )
    );
});

const getHeight = (count, maxCount) => `${(count / maxCount) * 100}%`;

const position = ref({ ...props.initialPosition });
const dragging = ref(false);
const offset = ref({ x: 0, y: 0 });

const startDrag = (event) => {
    dragging.value = true;
    offset.value = {
        x: event.clientX - position.value.x,
        y: event.clientY - position.value.y,
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
};

const onDrag = (event) => {
    if (dragging.value) {
        position.value = {
            x: event.clientX - offset.value.x,
            y: event.clientY - offset.value.y,
        };
    }
};

const stopDrag = () => {
    dragging.value = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
};
</script>
