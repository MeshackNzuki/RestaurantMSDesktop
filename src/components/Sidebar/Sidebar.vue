<template>
    <nav v-if="!login" ref="sidebar_id" :class="'rounded-e-xl h-screen  fixed left-0 top-0 overflow-scroll bottom-1 dark:text-slate-300 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-lg  flex-wrap items-center justify-between z-10 py-4  px-6 transition-all ease-in-out duration-300 ' +
        (isDark
            ? ' bg-gradient-to-r from-slate-800 via-sky-950 to-sky-950 '
            : ' bg-gradient-to-r from-white via-slate-50 to-sky-50 ') +
        (mainStore.sidebarOpen ? ' w-64 ' : '   w-24 ')
        ">
        <div
            class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center w-full mx-auto">
            <div
                :class="['flex  ml-2 mb-2 items-center w-full', mainStore.sidebarOpen ? 'justify-center' : 'justify-start']">
                <span><img class="w-7 h-7 mr-2" src="../../assets/logo.png" alt="logo" /></span> <span><router-link
                        v-if="mainStore.sidebarOpen"
                        class="md:block text-blueGray-600 text-sm uppercase font-bold p-4 px-0" to="/">
                        <span class="text-sky-500">Go</span>zero
                    </router-link></span>

            </div>

            <div class="flex flex-col justify-center items-center w-full">

                <!-- User -->
                <ul class="items-center flex flex-wrap list-none">
                    <li class="inline-block relative">
                        <div :class="`avatar rounded-full  ${theme?.themes[theme.currentTheme]?.bg} p-2`">
                            <div
                                :class="`w-12 rounded-full ring ${theme?.themes[theme.currentTheme]?.ring} ring-offset-2`">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <router-link to="/admin" :class="[
                'flex items-center justify-center w-full p-1 my-2 cursor-pointer rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none',
                theme?.themes[theme.currentTheme]?.bg,
                theme?.themes[theme.currentTheme]?.text,
            ]">
                <i v-if="
                    !route.path.startsWith('/admin') &&
                    user?.roles[0] === 'admin'
                " class="pi pi-arrow-left"></i>
                <i v-else class="pi pi-box"></i>

                <span v-if="mainStore.sidebarOpen">{{
                    !route.path.startsWith("/admin") &&
                        user?.roles[0] === "admin"
                        ? "Go to Admin"
                        : (zone + " AREA").toUpperCase()
                }}</span></router-link>
            <!-- Admin -->
            <div v-if="route.path.startsWith('/admin')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold my-1">
                    Admin Module
                </span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in adminAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                        <div v-for="(item, index) in adminAllAreAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                    </nav>
                </div>
            </div>

            <!-- Finance -->
            <div v-if="route.path.startsWith('/finance')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold my-1">
                    Finance Module
                </span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in financeAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                    </nav>
                </div>
            </div>

            <!-- Reservations Module -->
            <div v-if="route.path.startsWith('/reservations')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold my-1">Reservations Module</span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in ReservationAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                    </nav>
                </div>
            </div>

            <!-- Menu Module -->
            <div v-if="route.path.startsWith('/menu')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold my-1">Menu Module</span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in menuAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                    </nav>
                </div>
            </div>


            <!-- Inventory Module -->
            <div v-if="route.path.startsWith('/inventory')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold my-1">Inventory Module</span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in inventoryAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                    </nav>
                </div>
            </div>

            <!-- Transport Module -->
            <div v-if="route.path.startsWith('/transport')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold">Transport Module</span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in transportAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                    </nav>
                </div>
            </div>


            <div v-if="route.path.startsWith('/user/profile')" class="mt-0">
                <span class="w-full flex justify-center text-center text-xs font-bold my-2">Exit</span>
                <div class="relative flex flex-col rounded-x w-full">
                    <nav class="flex flex-col gap-1 text-base font-normal text-gray-700 dark:text-slate-300">
                        <div v-for="(item, index) in exitAreaItems" :key="index">
                            <router-link :to="item.route">
                                <div role="button" tabindex="0"
                                    class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                                    <div class="grid place-items-center mr-4">
                                        <i :class="[
                                            item.icon,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.bg,
                                            theme?.themes[
                                                theme.currentTheme
                                            ]?.text,
                                        ]"></i>
                                    </div>
                                    {{
                                        mainStore.sidebarOpen
                                            ? item.label
                                            : null
                                    }}
                                </div>
                            </router-link>
                        </div>
                        <hr class="bg-lime-300" />
                    </nav>
                </div>
            </div>

            <hr class="bg-lime-300" />
            <span @click="logout()">
                <div role="button" tabindex="0"
                    class="flex text-rose-500 font-bold items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div class="grid place-items-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            stroke="currentColor" aria-hidden="true" class="h-5 w-5">
                            <path fill-rule="evenodd"
                                d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    {{ mainStore.sidebarOpen ? "Shut Down" : null }}
                </div>
            </span>
        </div>
    </nav>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";

import { useRoute } from "vue-router";
import { useDark } from "@vueuse/core";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import { onClickOutside, useMediaQuery } from "@vueuse/core";
import { authStore } from "../../stores/authStore";
import { useMainStore } from "../../stores";
import { useThemeStore } from "../../stores/Theme";

const collapseShow = ref("hidden");
const toggleCollapseShow = (classes) => {
    collapseShow.value = classes;
};

const { user, logout } = authStore();
const mainStore = useMainStore();
const theme = useThemeStore();
const isDark = useDark({ disableTransition: false });
const route = useRoute();
const zone = ref(null);
const sidebar_id = ref(null);
const login = ref(false);

const adminAreaItems = ref([
    {
        route: "/admin/",
        label: "Dashboard",
        icon: "pi pi-compass  ",
    },
    {
        route: "/admin/users",
        label: "User Management",
        icon: "pi pi-users",
    },
    {
        route: "/user/profile",
        label: "Profile",
        icon: "pi pi-user",
    },
    {
        route: "/admin/settings",
        label: "Settings",
        icon: "pi pi-cog",
    },
]);

const ReservationAreaItems = ref([
    {
        route: "/reservations/",
        label: "Dashboard",
        icon: "pi pi-compass  ",
    },
    {
        route: "/reservations/table-reservations",
        label: "Table Reservations",
        icon: "pi pi-table",
    },
    {
        route: "/reservations/zone-reservations",
        label: "Zone Reservations",
        icon: "pi pi-bullseye",
    },
    {
        route: "/reservations/recurring-reservations",
        label: "Recurring Reservations",
        icon: "pi pi-history",
    },
    {
        route: "/reservations/tables",
        label: "Tables",
        icon: "pi pi-table",
    },
    {
        route: "/reservations/zones",
        label: "Zones",
        icon: "pi pi-bullseye",
    },
]);


const financeAreaItems = ref([
    {
        route: "/finance/",
        label: "Dashboard",
        icon: "pi pi-compass",
    },
    {
        route: "/finance/fee-payments",
        label: "Fee Payment",
        icon: "pi pi-dollar",
    },
    {
        route: "/finance/invoice",
        label: "Invoice",
        icon: "pi pi-file-export",
    },
    {
        route: "/finance/expense",
        label: "Expenses",
        icon: "pi pi-window-maximize",
    },

    {
        route: "/finance/fee-manager",
        label: "Fee Manager",
        icon: "pi pi-file-plus",
    },
    {
        route: "/finance/student-fees",
        label: "Student Fees",
        icon: "pi pi-dollar",
    },

    {
        route: "/finance/payments-report",
        label: "Payment Report",
        icon: "pi pi-receipt",
    },
    {
        route: "/user/profile",
        label: "Profile",
        icon: "pi pi-user",
    },
    {
        route: "/settings",
        label: "Settings",
        icon: "pi pi-cog",
    },
]);



const inventoryAreaItems = ref([
    { route: "/inventory/", label: "Dashboard", icon: "pi pi-compass" },
    {
        route: "/inventory/purchases",
        label: "Purchase",
        icon: "pi pi-cart-arrow-down",
    },
    { route: "/inventory/items", label: "Items", icon: "pi pi-box" },
    {
        route: "/inventory/suppliers",
        label: "Suppliers",
        icon: "pi pi-warehouse",
    },
    {
        route: "/inventory/categories",
        label: "Categories",
        icon: "pi pi-sitemap",
    },
]);


const transportAreaItems = ref([
    { route: "/transport/", label: "Dashboard", icon: "pi pi-compass" },
    { route: "/transport/vehicles", label: "Vehicles", icon: "pi pi-users" },
    { route: "/transport/routes", label: "Routes", icon: "pi pi-route" },
    { route: "/transport/drivers", label: "Drivers", icon: "pi pi-cog" },
]);

const exitAreaItems = ref([
    { route: "/", label: "Exit", icon: "pi pi-arrow-circle-left" },
]);


const adminAllAreAreaItems = ref([
    { route: "/pos", icon: "pi pi-briefcase", label: "POS" },
    { route: "/sales/", icon: "pi pi-dollar", label: "Sales" },
    { route: "/reservations", icon: "pi pi-clock", label: "Reservations" },
    { route: "/menu", icon: "pi pi-file", label: "Menu" },
    { route: "/finance/", icon: "pi pi-dollar", label: "Finance" },
    { route: "/inventory", icon: "pi pi-file", label: "Inventory" },
    { route: "/transport", icon: "pi pi-send", label: "Transport" },
]);

onMounted(() => {
    // Access current route properties directly on route object
    if (route.path === "/login") {

        login.value = true;
    }

    zone.value = route.path;

    //handle clink out
    const isMobile = useMediaQuery(
        "(min-width: 100px) and (max-width: 1024px)",
    );

    if (isMobile.value) {
        onClickOutside(sidebar_id, (event) => {
            mainStore.closeSidebar();
        });
    }
});

// Watch for changes in the current route path
watch(
    () => route.path,
    (newPath) => {
        login.value = newPath === "/login";
        zone.value = route.path.split("/")[1];
    },
);
</script>
<style scoped>
i {
    padding: 5px;
    /* Adjust padding for a smoother look */
    display: flex;
    /* Necessary for the hexagon shape */
    justify-content: center;
    align-items: center;
    box-shadow:
        0 3px 6px rgba(0, 0, 0, 0.1),
        /* Stronger shadow with blur */
        0 2px 3px rgba(0, 0, 0, 0.1);
    /* Soft shadow closer to the hexagon */
    /* More rounded hexagon */
    width: 30px;
    /* Increase size for smoother feel */
    height: 30px;
    /* Maintain square aspect ratio */
    line-height: 30px;
    /* Center text vertically */
    transition: all 0.3s ease;
    /* For smooth hover effect */
    border-radius: 50%;
    /* Soft corners for smoothness */
}

/* Add hover effect */
i:hover {
    background: #444;
    /* Darker background on hover */
    color: aliceblue;
    box-shadow:
        0 12px 24px rgba(0, 0, 0, 0.2),
        /* Larger shadow */
        0 6px 8px rgba(0, 0, 0, 0.1);
    /* Soft shadow near the hexagon */
    transform: scale(1.1);
    /* Slight zoom */
}
</style>
