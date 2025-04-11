<template>
    <div :class="'flex flex-row justify-between shadow-lg px-2 py-2 w-48 rounded-3xl gap-2 ' +
        (isDark
            ? 'bg-gradient-to-r from-slate-800 via-sky-950 to-sky-900 shadow-sky-700'
            : 'bg-gradient-to-r from-white via-blue-50 to-sky-50')
        ">
        <div class="flex justify-end items-center">
            <i :class="'text-2xl dark:text-slate-100 ' + icon"></i>
        </div>
        <div class="space-y-1">
            <div class="flex items-center space-x- text-smtext-left text-slate-500 dark:text-slate-300">
                <span>{{ label }}</span>
            </div>
            <div class="dark:text-slate-100">{{ quantity }}</div>
        </div>

        <div class="flex items-center space-x-1 text-smtext-left text-emerald-500 dark:text-emerald-300">
            <span class="text-sm font-light">{{ change }}</span>
        </div>
    </div>
</template>
<script setup>
import { useDark, useToggle } from "@vueuse/core";
const props = defineProps({
    label: {
        type: String,
        default: "Revenue",
    },
    change: {
        type: String,
        default: "+9%",
    },
    quantity: {
        type: String,
        default: "...",
    },
    up: {
        type: String,
        default: "none",
    },
    icon: {
        type: String,
        default: "pi pi-dollar",
    },
});

const isDark = useDark({ disableTransition: false });
</script>
