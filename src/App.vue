<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { useMainStore } from "./stores";
import Toast from "primevue/toast";
import "../node_modules/vue3-marquee-slider/dist/style.css";
import "vue3-toastify/dist/index.css";
import { authStore } from "./stores/authStore";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import TopBar from "./components/TopBar/TopBar.vue";
import { ref, computed, watch } from "vue";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import axios from "axios";
import { Ref } from "vue";
import "./AxiosConfig";
import { useThemeStore } from "./stores/Theme";

const route = useRoute();
const login = ref(false);
const show = ref(false);
const pos = ref(false);
const mainStore = useMainStore();
const themeStore = useThemeStore();
const confirm = useConfirm();

const confirm1 = () => {
    return new Promise((resolve, reject) => {
        confirm.require({
            message: "Are you sure to delete this item?",
            header: "Confirm Delete?",
            icon: "pi pi-exclamation-triangle text-red-500",
            acceptLabel: "Delete",
            rejectLabel: "Cancel",
            acceptClass:
                "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full",
            rejectClass:
                "bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full",
            accept: () => resolve(true),
            reject: () => reject(false),
        });
    });
};
// Set login to true if the current route is /login
if (route.path === "/login") {
    login.value = true;
}

if (route.path === "/pos") {
    pos.value = true;
}

watch(
    () => route.path,
    (newPath) => {
        login.value = newPath === "/login";
        pos.value = newPath === "/pos";
    },
);

axios.interceptors.request.use(
    async function async(config) {
        if (config.method === "delete") {
            const confirmed = await confirm1();
            console.log("confirmed", confirmed);
            if (!confirmed) {
                return Promise.reject({ canceled: true });
            }
        }
        const { user } = authStore(); // Get user info from authStore
        const token = (user as any)?.token;

        // Show loader only if config.showLoader is not explicitly set to false
        if ((config as any).showLoader !== false) {
            show.value = true;
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        // Hide loader in case of request error
        show.value = false;
        return Promise.reject(error);
    },
);

axios.interceptors.response.use(
    function (response) {
        // Hide loader only if config.showLoader is not explicitly set to false
        if ((response.config as any).showLoader !== false) {
            show.value = false;
        }
        return response;
    },
    function (error) {
        // Hide loader in case of response error
        if (error.config.showLoader !== false) {
            show.value = false;
        }
        return Promise.reject(error);
    },
);
</script>
<template>
    <div v-if="show" id="loader"
        class="fixed inset-0 flex justify-center items-center bg-sky-950 bg-opacity-5 z-[999] select-none">
        <div class="axiosspinner"></div>
    </div>

    <div :class="[
        'min-h-screen relative antialiased hover:subpixel-antialiased select-none',
        (themeStore as any).fonts[themeStore.currentFont].font,
        !(login || pos) ? (mainStore.sidebarOpen ? 'ms-64 p-4' : 'ms-24 p-4') : 'm-0'
    ]">
        <Toast />
        <ConfirmDialog />
        <Sidebar v-if="!(login || pos)" />
        <TopBar v-if="!(login)" />

        <router-view v-slot="{ Component }">
            <div :class="['min-h-screen', !(login || pos) ? 'mt-10' : '']">
                <transition name="page">
                    <component :is="Component" />
                </transition>
            </div>
        </router-view>
    </div>
</template>


<style scoped>
.axiosspinner {
    width: 48px;
    height: 48px;
    border: 3px dotted #043755;
    border-style: solid solid dotted dotted;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: rotation 2s linear infinite;
}

.axiosspinner::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border: 3px dotted #FF3D00;
    border-style: solid solid dotted;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    animation: rotationBack 1s linear infinite;
    transform-origin: center center;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes rotationBack {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}
</style>
