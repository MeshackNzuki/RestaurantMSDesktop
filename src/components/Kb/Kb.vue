<template>
    <div class="keyboard bg-gray-800 px-6 py-2 rounded-3xl grid gap-2  z-[1000] absolute" :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        transform: 'translate(-50%, -30%)'
    }" @mousedown="startDrag" @touchstart="startDrag" ref="keyboardRef">
        <!-- First row -->
        <div class="grid grid-cols-10 gap-2">
            <button v-for="key in layout[0]" :key="key"
                class="py-3 px-4 uppercase bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-2xl text-xl font-semibold shadow-lg text-center flex items-center justify-center transition-all hover:shadow-sky-500/40 ring-1 ring-gray-600 hover:ring-sky-500/50"
                @click="onKeyPress(key)">
                {{ key }}
            </button>
        </div>

        <!-- Second row -->
        <div class="grid grid-cols-11 gap-2">
            <span class="col-span-1"></span> <!-- indent -->
            <button v-for="key in layout[1]" :key="key"
                class="py-3 px-4 uppercase bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-2xl text-xl font-semibold shadow-lg text-center flex items-center justify-center transition-all hover:shadow-sky-500/40 ring-1 ring-gray-600 hover:ring-sky-500/50"
                @click="onKeyPress(key)">
                {{ key }}
            </button>
        </div>

        <!-- Third row -->
        <div class="grid grid-cols-10 gap-2">
            <span class="col-span-1"></span> <!-- indent -->
            <button v-for="key in layout[2]" :key="key"
                class="py-3 px-4 uppercase bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-2xl text-xl font-semibold shadow-lg text-center flex items-center justify-center transition-all hover:shadow-sky-500/40 ring-1 ring-gray-600 hover:ring-sky-500/50"
                @click="onKeyPress(key)">
                {{ key }}
            </button>
            <span class="col-span-1"></span> <!-- to fill space to 10 columns -->
        </div>

        <!-- Fourth row -->
        <div class="grid grid-cols-10 gap-2">
            <span class="col-span-2"></span> <!-- bigger indent -->
            <button v-for="key in layout[3]" :key="key"
                class="py-3 px-4 uppercase bg-gradient-to-b from-gray-700 to-gray-800 text-white rounded-2xl text-xl font-semibold shadow-lg text-center flex items-center justify-center transition-all hover:shadow-sky-500/40 ring-1 ring-gray-600 hover:ring-sky-500/50"
                @click="onKeyPress(key)">
                {{ key }}
            </button>
            <span class="col-span-1"></span> <!-- fill to 10 cols -->
        </div>

        <!-- Control keys -->
        <div class="mt-2 grid grid-cols-5 gap-2">
            <button class="bg-yellow-600 text-white py-2 px-4 rounded-lg text-lg" @click="toggleCaps">
                Caps
            </button>
            <button class="bg-sky-500 text-white py-2 px-4 rounded-lg text-lg" @click="toggleSymbols">
                @#$
            </button>
            <button class="bg-red-500 text-white py-2 px-4 rounded-lg text-lg" @click="onBackspace">
                ⌫
            </button>
            <button class="bg-sky-500 text-white py-2 px-4 rounded-lg text-lg col-span-2" @click="onEnter">
                Enter
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted, ref, computed } from 'vue';

const emit = defineEmits(['input', 'backspace', 'enter']);

const isCaps = ref(false);
const isSymbols = ref(false);

const alphaLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const symbolLayout = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    ['_', '+', '=', '[', ']', '{', '}', '\\', '|'],
    [';', ':', '"', "'", '<', '>', ',', '.', '?'],
    ['`', '~', '/', '-', '€', '£', '¥'],
];

const layout = computed(() => {
    const base = isSymbols.value ? symbolLayout : alphaLayout;
    return base.map((row) =>
        row.map((key) =>
            isCaps.value && !isSymbols.value ? key.toUpperCase() : key
        )
    );
});

const onKeyPress = (key: string) => emit('input', key);
const onBackspace = () => emit('backspace');
const onEnter = () => emit('enter');
const toggleCaps = () => (isCaps.value = !isCaps.value);
const toggleSymbols = () => (isSymbols.value = !isSymbols.value);

// --- Draggable logic ---
const position = ref({ x: 900, y: 900 });
const dragging = ref(false);
const offset = ref({ x: 0, y: 0 });
const keyboardRef = ref<HTMLElement | null>(null);

onMounted(() => {
    const winWidth = window.innerWidth;
    const keyboardWidth = keyboardRef.value?.offsetWidth || 600;
    position.value = {
        x: winWidth / 2,
        y: window.innerHeight - 250,
    };
});

const startDrag = (e: MouseEvent | TouchEvent) => {
    dragging.value = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    offset.value = {
        x: clientX - position.value.x,
        y: clientY - position.value.y,
    };

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('touchend', stopDrag);
};

const dragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.value) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    position.value = {
        x: clientX - offset.value.x,
        y: clientY - offset.value.y,
    };
};

const stopDrag = () => {
    dragging.value = false;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', stopDrag);
};
</script>

<style scoped>
.keyboard {
    user-select: none;
    cursor: grab;
    touch-action: none;
    /* smoother drag on touch screens */
}
</style>
