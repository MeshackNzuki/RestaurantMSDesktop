<template>
    <!-- <Header /> -->
    <div
        class=" h-screen flex flex-wrap h-100 w-full items-center justify-center overflow-hidden bg-[url('https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg?t=st=1739346332~exp=1739349932~hmac=f6935e58f5d1f6f338ba9216101ffb12812c3f089976600da2ca1769141a3faf&w=1380')] bg-cover bg-no-repeat bg-center">
        <div class="lg:w-1/2">
            <section class="">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div class="font-bold text-gray-900">ROLLINGSTONES EATERY</div>
                    <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img class="w-8 h-8 mr-2" src="../../assets/logo.png" alt="logo" />
                        <div class="font-bold"><span class="text-sky-500 ">GO</span>ZERO RESTAURANT ERP</div>
                    </a>
                    <div
                        class="w-full bg-white rounded-lg glass shadow dark:border md:mt-0 sm:max-w-sm xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 ">
                            <h1
                                class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in <span v-if="message"
                                    class="text-sm w-full px-4 animate animate-pulse text-semibold text-center text-red-600 bg-red-100 rounded-md">{{
                                        message
                                    }}</span>
                            </h1>

                            <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
                                <div>
                                    <label for="username"
                                        class="block mb-2 text-smtext-left text-gray-900 dark:text-white font-semibold">Your
                                        User name</label>
                                    <input v-model="username" type="username" name="username" id="username"
                                        class="bg-gray-50 border border-sky-400 text-gray-900 sm:text-sm rounded-full focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                        placeholder="name@company.com" required />
                                </div>
                                <div>
                                    <label for="password"
                                        class="block mb-2 text-smtext-left text-gray-900 dark:text-white font-semibold">Password</label>
                                    <input v-model="password" type="password" name="password" id="password"
                                        placeholder="••••••••"
                                        class="bg-gray-50 border border-sky-300 text-gray-900 sm:text-sm rounded-full focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                        required />
                                </div>

                                <button type="submit"
                                    class="w-full dark:gray-400 text-white bg-sky-500 hover:bg-primary-700 focus:ring-4 font-semibold focus:outline-none focus:ring-primary-300text-left rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <div v-if="isLoading">AUTHORIZING...
                                    </div>
                                    <div v-else>LOGIN</div>
                                </button>
                                <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-end">
                                    Forgot your password?
                                    <a href="#"
                                        class="text-start underline text-sky-500 hover:underline dark:text-primary-500">
                                        Reset Now</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { authStore } from "../../stores/authStore";
import Footer from "../../components/Footer.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../../stores";

const { login } = authStore();

const { closeSidebar } = useMainStore();

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();
const message = ref("");

const handleLogin = async () => {
    isLoading.value = true;
    message.value = "";

    try {
        const response = await window.electronAPI.login({
            username: username.value, // or rename to username.value
            password: password.value,
        });

        if (response.success) {
            console.log('Logged in as', response.username, 'Role:', response.role);

            // Optional: store login state
            login(response); // Assuming this sets global user state
            // Redirect based on role
            if (response.role === 1) {
                router.push("/admin/");
                console.log('tring role 1',);
            } else {
                console.log('tring role 2',);
                router.push("/admin/pos");
            }
        } else {
            message.value = "Invalid username or password.";
        }

    } catch (error) {
        console.error(error);
        message.value = "Something went wrong. Please try again!";
    } finally {
        isLoading.value = false;
        setTimeout(() => {
            message.value = "";
        }, 6000);
    }
};


onMounted(() => {
    closeSidebar();
});
</script>
