<template>
    <div :class="'flex flex-col justify-between shadow-lg px-4 py-2 w-[15em] rounded-3xl ' +
        (isDark
            ? 'bg-gradient-to-r from-slate-800 via-sky-950 to-sky-900 shadow-sky-700'
            : 'bg-gradient-to-r from-white via-purple-50 to-sky-100')
        ">
        <div class="flex items-center space-x-1 text-smtext-left text-slate-500 dark:text-slate-300">
            <span>{{ label }}</span>
        </div>
        <div class="flex justify-between items-center gap-1">
            <span></span>
            <div class="text-2xl dark:text-slate-100 text-right">
                {{ quantity }}
            </div>
            <i :class="'text-2xl dark:text-slate-100 ' + icon"></i>
        </div>

        <div class="flex items-center justify-between text-sm text-emerald-500 dark:text-emerald-300">
            <span class="text-xs font-light flex flex-row gap-1">{{ description }}
                <svg v-if="up == 'up'" class="w-4 h-4 text-yellow" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clip-rule="evenodd"></path>
                </svg>
                <svg v-else-if="up == 'down'" class="w-4 h-4 text-yellow" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M8 13a1 1 0 100 2H3a1 1 0 01-1-1v-5a1 1 0 112 0v3.586l4.293-4.293a1 1 0 011.414 0L12 9.414l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0L9 11.414l-4.293 4.293V13z"
                        clip-rule="evenodd"></path>
                </svg>
                <span v-else
                    class="bg- text-yellow shadow-sm shadow-sky-400 rounded-full flex justify-center items-center"><i
                        class="pi pi-check-circle"></i></span></span>
            <span class="px-1">|</span>
            <router-link
                class="ml-6 flex flex-row justify-center text-sky-500 font-bold hover:scale-105 transition-all duration-150 items-center gap-1 text-xs"
                :to="link">View <i class="pi pi-arrow-right mt-0.5 text-xs"></i></router-link>
        </div>
    </div>
</template>
<script setup>
import { useDark } from "@vueuse/core";

const props = defineProps({
    label: {
        type: String,
        default: "Revenue",
    },
    description: {
        type: String,
        default: "32k increase",
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
