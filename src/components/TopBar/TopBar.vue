<template>
    <div class="bg-white fixed top-0 right-0" :class="returnClass">
        <div :class="[
            'flex  w-full flex-row justify-between items-center h-8 dark:text-slate-300 ps-2',
            theme?.themes[theme.currentTheme]?.text,
            isDark
                ? ' bg-gradient-to-r from-slate-800 via-sky-950 to-sky-950 '
                : theme?.themes[theme.currentTheme]?.bg,
        ]" style="right: 0">
            <button v-if="route.path.startsWith('/pos')" @click="() => route.push('/admin')"><i
                    class="pi pi-wave-pulse ml-1"></i></button>
            <button v-else @click="mainStore.toggleSidebar()">
                <i class="pi pi-bars mx-2 font-extralight text-sm"></i>
            </button>
            <div class="flex">
                <span class="font-extralight text-sm" v-if="user?.name">{{ greeting() }}, {{ user?.name }}!</span>
            </div>

            <div class="flex justify-center items-center px-4 space-x-2 h-full font-extralight text-sm">
                <button @click="() => syncSales()"><i
                        :class="['pi pi-sync text-sm text-light', spin ? 'pi-spin' : '']"></i><span class="mx-1"
                        v-if="spin">AutoSync...</span></button>
                <label class="cursor-pointer grid place-items-center">
                    <input type="checkbox" value="synthwave"
                        class="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
                        @click="toggleDark()" />
                    <svg class="col-start-2 row-start-1 stroke-cyan-500 fill-sky-500" xmlns="http://www.w3.org/2000/svg"
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg class="col-start-1 row-start-1 stroke-cyan-500 fill-sky-500" xmlns="http://www.w3.org/2000/svg"
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path
                            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                </label>
                <div @click="logout()" class="flex items-center justify-center">
                    <div class="cursor-pointer text-sky-800 dark:text-amber-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            stroke="currentColor" aria-hidden="true"
                            :class="`h-5 w-5  ${theme?.themes[theme.currentTheme]?.text}`">
                            <path fill-rule="evenodd"
                                d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <button class="p-1 flex items-center justify-center" @click="toggleRightPanel()">
                    <i class="pi pi-cog pi-spin text-sm"></i>
                </button>
                <button class="p-1 flex items-center justify-center hover:bg-gray-600" @click="minimizeWin()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="5" y="11" width="14" height="1" />
                    </svg>
                </button>
                <button class="p-1 flex items-center justify-center hover:bg-gray-600" @click="maximizeWin()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1">

                        <!-- Shadow copy (slightly offset and darker/lighter) -->
                        <rect x="6.5" y="6.5" width="12" height="12" stroke="black" opacity="0.4" />

                        <!-- Main icon -->
                        <rect x="6" y="6" width="12" height="12" />
                    </svg>
                </button>

                <button class="p-1 flex items-center justify-center hover:bg-gray-600" @click="closeWin()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor"
                        stroke-width="1" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div :class="[
        'w-48 z-50 right-0 bg-slate-200 p-4 shadow-sm rounded-l-lg top-16 fixed transition-all ease-in-out duration-300',
        show ? 'block' : 'hidden',
    ]">
        <div class="flex flex-col gap-2 relative" ref="target">
            <button class="p-1 absolute top-1 right-1" @click="toggleRightPanel()">
                <i class="pi pi-times"></i>
            </button>
            <span class="text-sky-900 font-bold">App Configurator</span>
            <h1 class="font-bold">Select Theme Color</h1>
            <div v-for="i in theme.themes" class="flex flex-row gap-2 items-center cursor-pointer"
                @click="theme.setTheme(i.name)">
                <span :class="`size-7 rounded-full cursor-pointer hover:scale-105 ${i.bg} block`"></span>{{ i.name }}
            </div>
            <h1 class="font-bold">Select Theme Font</h1>

            <div v-for="i in theme.fonts" :class="[
                'flex flex-row gap-2 items-center cursor-pointer',
                i.font,
                i.name == theme.currentFont
                    ? ' bg-gray-200 shadow-md rounded-md'
                    : '',
            ]" @click="theme.setFont(i.name)">
                <i
                    :class="`pi pi-check-circle   ${i.name == theme.currentFont ? ' text-emerald-500' : 'text-sky-500'}`"></i>{{
                        i.name }}
            </div>
            <div class="flex flex-col justify-center items-center gap-2 mt-3">
                <CommonButton buttonText="Use Default" icon="pi pi-refresh" :action="() => {
                    theme.setTheme('Light');
                    theme.setFont('Exo');
                }
                    " />
                <label class="cursor-pointer grid place-items-center">
                    <input type="checkbox" value="synthwave"
                        class="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
                        @click="toggleDark()" />
                    <svg class="col-start-2 row-start-1 stroke-cyan-500 fill-sky-500" xmlns="http://www.w3.org/2000/svg"
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg class="col-start-1 row-start-1 stroke-cyan-500 fill-sky-500" xmlns="http://www.w3.org/2000/svg"
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path
                            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                </label>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { onClickOutside, useDark, useToggle } from "@vueuse/core";
import { useMainStore } from "../../stores";
import { authStore } from "../../stores/authStore";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import { useThemeStore } from "../../stores/Theme";

const isDark = useDark({ disableTransition: false });
const toggleDark = useToggle(isDark);

const collapseShow = ref("hidden");
const toggleCollapseShow = (classes) => {
    collapseShow.value = classes;
};


const { user, logout } = authStore();
const mainStore = useMainStore();
const target = ref(null);
const route = useRoute();
const login = ref(false);
const show = ref(false);
const zone = ref(null);
const theme = useThemeStore();
const spin = ref(false);

onMounted(() => {
    // Access current route properties directly on route object
    if (route.path === "/login") {
        login.value = true;
    }
    zone.value = route.path;

});

const returnClass = computed(() => {
    if (route.path === '/pos') {
        return 'left-0'
    }
    if (mainStore.sidebarOpen) {
        return 'left-60'
    }
    return 'left-20'
});
console.log("elecron win apisx", window.electronAPI);

const minimizeWin = () => {
    const mini = window.electronAPI.minimize();
};
const maximizeWin = () => {
    const maxi = window.electronAPI.maximize();
};
const closeWin = () => {
    window.electronAPI.close();
};


// Watch for changes in the current route path
watch(
    () => route.path,
    (newPath) => {
        login.value = newPath === "/login";
        zone.value = route.path.split("/")[1];
    },
);
const toggleRightPanel = () => {
    show.value = !show.value;
};
onClickOutside(target, () => {
    if (show.value) {
        toggleRightPanel();
    }
});

const updateGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return "Good Morning";
    } else if (currentHour < 18) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
};

const greeting = () => {
    return updateGreeting();
};
setInterval(greeting, 60000);
setInterval(() => {
    spin.value = !spin.value;
}, 1000 * 60 * 5);
</script>
