<template>
    <div
        ref="draggable"
        class="absolute min-w-24 min-h-12 max-w-[300px] bg-gray-200 border-2 px-2 rounded-lg shadow-lg"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
        
    >
        <div class="w-full flex justify-center active:cursor-grabbing" @mousedown="startDrag">
            <GripHorizontalIcon />
        </div>
        <div class="w-full h-full py-2">
            {{ data }}
        </div>
    </div>
</template>

<script setup>
import { GripHorizontalIcon } from "lucide-vue-next";
import { ref, defineProps } from "vue";

const props = defineProps({
    initialPosition: {
        type: Object,
        default: () => ({ x: 100, y: 100 }), // 默认初始位置
    },
    data: {
        type: Object,
        default: () => ({}),
    },
});

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
