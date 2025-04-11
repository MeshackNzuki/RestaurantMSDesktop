<template>
    <button
        :class="[
            'py-1 px-2 rounded-full shadow-lg dark:shadow-slate-300 dark:shadow-sm',
            'hover:translate-x-1 hover:scale-110 transition duration-200 ease-out',
            // Conditionally apply bg-sky-500 if the theme is Light, else use the current theme's background
            theme?.currentTheme === 'Light'
                ? 'bg-sky-500'
                : theme?.themes[theme.currentTheme]?.bg,
            // Conditionally apply text-gray-50 if the theme is Light, else use the current theme's text color
            theme?.currentTheme === 'Light'
                ? 'text-gray-50'
                : theme?.themes[theme.currentTheme]?.text,
            buttonText === 'Del' || buttonText === 'Delete' ? 'bg-red-500' : '', // Special condition, overrides theme
            classes, // User-defined classes override everything else
        ]"
        @click="handleClick"
    >
        <i :class="icon"></i>
        <i
            v-if="!icon && buttonText === 'Edit'"
            class="pi pi-pencil text-xs"
        ></i>
        {{ buttonText }}
    </button>
</template>

<script setup>
import { useThemeStore } from "../../stores/Theme";

const theme = useThemeStore();
// Props
const props = defineProps({
    buttonText: { type: String, default: "" },
    action: { type: Function, default: () => {} },
    classes: { type: String, default: "" },
    icon: { type: String, default: null },
});

const handleClick = () => {
    props.action();
};
</script>
