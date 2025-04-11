<template>
    <div :class="[
        'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg mt-12 h-screen',
        isDark
            ? ' bg-gradient-to-r from-slate-800 via-sky-950 to-sky-950 text-slate-50 '
            : ' bg-gradient-to-r from-sky-50 via-slate-100 to-sky-50 text-gray-600',
    ]">
        <div class="rounded-t mb-0 px-6 py-6">
            <div class="flex flex-col items-center">
                <!-- User Avatar -->
                <div class="avatar relative">
                    <div class="w-24 rounded-full ring ring-sky-500 ring-offset-base-100 ring-offset-2">
                        <img v-if="fileUrl.length" :src="fileUrl" class="w-full" />
                        <img v-else :src="authStore.user?.avatar ||
                            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                            " alt="User Avatar" />
                    </div>
                    <!-- Avatar Upload Button -->
                    <label
                        class="absolute bottom-0 right-0 bg-sky-500 text-white px-2 py-1 rounded-full text-xs cursor-pointer">
                        <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
                        Edit
                    </label>
                </div>
                <h6 class="text-xl font-bold mt-4">My Account</h6>
            </div>
        </div>
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form @submit.prevent="saveSettings">
                <h6 class="text-gray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    User Information
                </h6>
                <div class="flex flex-wrap">
                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-xs font-bold mb-2">Username</label>
                            <input v-model="formData.username" type="text"
                                class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-xs font-bold mb-2">Email address</label>
                            <input v-model="formData.email" type="email"
                                class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-xs font-bold mb-2">First Name</label>
                            <input v-model="formData.first_name" type="text"
                                class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                    <div class="w-full lg:w-6/12 px-4">
                        <div class="relative w-full mb-3">
                            <label class="block uppercase text-xs font-bold mb-2">Last Name</label>
                            <input v-model="formData.last_name" type="text"
                                class="border-0 px-3 py-3 placeholder-gray-300 text-gray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                </div>

                <hr class="mt-6 border-b-1 border-gray-300" />

                <div class="text-center mt-6">
                    <CommonButton buttonText="Save Settings" />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useDark } from "@vueuse/core";
import { authStore } from "../stores/authStore";
import CommonButton from "../components/Buttons/CommonButton.vue";

const isDark = useDark({ disableTransition: false });
const fileUrl = ref([])

const formData = ref({
    username: authStore.user?.username || "",
    email: authStore.user?.email || "",
    first_name: authStore.user?.first_name || "",
    last_name: authStore.user?.last_name || "",
    avatar: null,
});

const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        formData.value.avatar = file;
        fileUrl.value = URL.createObjectURL(formData.value.avatar);
    }
};

const saveSettings = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        if (value) {
            data.append(key, value);
        }
    });

    console.log("Form submitted with:", Object.fromEntries(data));
    // Perform API call here with `data`
};
</script>
