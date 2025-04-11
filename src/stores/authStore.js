import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import axios from "axios";
import router from "../router";


export const authStore = defineStore("authStore", {
    persist: true,
    state: () => ({
        is_authenticated: false,
        user: null,
    }),
    actions: {
        login(userData) {
            // Perform login operation here...
            // After successful login, update the store's state with user data
            this.user = userData;

            if (userData.token) {
                this.is_authenticated = true;
            }
        },
        logout() {
            // Perform logout operation here...
            this.user = null;
            this.is_authenticated = false;
            // Reset the store's state
            axios
                .post("/logout")
                .then(() => {
                    this.user = null;
                    this.is_authenticated = false;
                    router.push("/login");
                })
                .catch((error) => {
                    console.error("Logout failed:", error);
                    //still remove user data
                    this.user = null;
                    this.is_authenticated = false;
                    router.push("/login");
                });
            router.push("/login");
        },
    },
});
