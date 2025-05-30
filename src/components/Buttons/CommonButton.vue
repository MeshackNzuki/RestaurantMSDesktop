<template>
    <button type="submit" attrib :class="[
        // Apply bg-sky-500 and text-gray-100 when the theme is Light, otherwise use the current theme's bg and text
        theme?.currentTheme === 'Light'
            ? 'bg-sky-500 text-gray-100'
            : theme?.themes[theme.currentTheme]?.bg +
            ' ' +
            theme?.themes[theme.currentTheme]?.text,
        'px-4 py-1 rounded-full hover:translate-x-1 hover:scale-105 transition whitespace-nowrap duration-200 ease-out shadow-md select-none text-sm',
        'dark:shadow-slate-300 dark:shadow-sm', // Apply dark shadow classes
        classes, // Additional class when `attrib` is not empty
    ]" @click="handleClick">
        <i :class="`${icon} font-extralight text-sm`"></i>
        {{ buttonText }}<i :class="`${icon2} font-extralight text-sm`"></i>
    </button>
</template>

<script setup>
import { useThemeStore } from "../../stores/Theme";

const theme = useThemeStore();
// Props
const props = defineProps({
    attrib: { type: String, default: "" },
    buttonText: { type: String, default: "Button Comp" },
    action: { type: Function, default: () => { } },
    classes: { type: String, default: "" },
    icon: { type: String, default: null },
    icon2: { type: String, default: null },
});
const handleClick = () => {
    props.action();
};
</script>
