<template>
    <div :class="['p-3 text-3xl transition-all duration-300', store.currentZoom]">
        <div :class="[
            'overflow-x-auto rounded-md shadow-md ',
            store.currentZoom,
        ]">
            <div :class="[
                'h-10 p-1 flex flex-row justify-between px-4 items-center',
                theme?.themes[theme.currentTheme]?.bg,
                theme?.themes[theme.currentTheme]?.text,
            ]">
                <span class="font-bold">{{ title }}</span>
                <span class="font-light">
                    {{ rows > 0 ? "Showing : " + rows + " rows" : "" }}</span>
                <span class="font-bold"><i @click="zoomOut"
                        class="pi pi-minus cursor-pointer bg-sky-500 rounded-badge p-1 text-white hover:scale-105"></i><span
                        class="mx-1 font-light">Zoom</span><i @click="zoomIn"
                        class="pi pi-plus cursor-pointer bg-sky-500 rounded-badge p-1 text-white hover:scale-105"></i></span>
                <span>
                    <div class="form-control">
                        <input :value="query" :type="search_type" @input="updateValue" type="text"
                            :placeholder="search_placeholder"
                            class="input-bordered md:w-auto mx-1 w-full rounded-full px-2 font-light" />
                    </div>
                </span>
                <span class="flex flex-row gap-2">
                    <slot name="actions"></slot>
                </span>
                <span class="relative"><i class="pi pi-spin pi-sync"></i></span>
            </div>
            <table :class="'table-auto w-full bg-slate-50 dark:bg-sky-950 text-sm' + fs
                ">
                <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                        <th v-for="(header, index) in headers" :key="index" class="p-2 whitespace-nowrap">
                            <div class="font-semibold text-left">
                                {{ header }}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-slate-400 dark:text-slate-300">
                    <slot name="content"></slot>
                </tbody>
            </table>
            <div v-if="rows == 0" class="flex justify-center my-4 text sm">
                <span class="px-3 py-1 bg-sky-200 rounded-badge">
                    No data yet!</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { useThemeStore } from "../../stores/Theme";
import { useMainStore } from "../../stores/index";
const { zoomIn, zoomOut } = useMainStore();
const store = useMainStore();

const theme = useThemeStore();

// Define props
const props = defineProps({
    tableTitle: {
        type: String,
        required: true,
    },
    headers: {
        type: Array,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    query: {
        type: String,
        default: "",
    },
    search_type: {
        type: String,
        default: "text",
    },
    search_placeholder: {
        type: String,
        default: "Search this table",
    },
    rows: {
        type: Number,
        default: 0,
    },
});

// Define emits
const emit = defineEmits(["update:query"]);

// Update value and emit change event
const updateValue = (event) => {
    emit("update:query", event.target.value);
};
</script>
