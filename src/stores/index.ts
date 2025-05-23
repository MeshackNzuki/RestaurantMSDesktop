import Orders from "@/views/inventory/Orders.vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
    
    persist: true,

    state: () => ({
        zoom_counter: 1,
        sidebarOpen: false,
        greetings: "Good Morning",
        zoom_levels: ["text-xs", "text-base", "text-lg", "text-xl", "text-2xl"],
        orders: [] 
    }),
    getters: {
        currentZoom: (state) => state.zoom_levels[state.zoom_counter], // Get the current zoom class
    },

    actions: {
        zoomIn() {
            // this.$reset();
            if (this.zoom_counter < this.zoom_levels.length - 1) {
                this.zoom_counter++;
            }
        },
        zoomOut() {
            if (this.zoom_counter > 0) {
                this.zoom_counter--;
            }
        },

        // other utilities
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        //primariry for click outside
        closeSidebar() {
            this.sidebarOpen = false;
        },
        updateGreeting() {
            const currentHour = new Date().getHours();

            if (currentHour < 12) {
                this.greetings = "Good Morning";
            } else if (currentHour < 18) {
                this.greetings = "Good Afternoon";
            } else {
                this.greetings = "Good Evening";
            }
        },
        async startInterval() {
            this.updateGreeting();
            setInterval(this.updateGreeting, 3000);
        },   
          addOrder(order) {
            this.orders.push(order)
          },
      
          removeOrder(index) {
            this.orders.splice(index, 1)
          },
      
          clearOrders() {
            this.orders = []
          }    
       
    },
});
