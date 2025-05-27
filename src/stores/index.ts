import Orders from "@/views/inventory/Orders.vue";
import { set } from "@vueuse/core";
import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
    
    persist: true,

    state: () => ({
        zoom_counter: 1,
        sidebarOpen: false,
        greetings: "Good Morning",
        zoom_levels: ["text-xs", "text-base", "text-lg", "text-xl", "text-2xl"],
        orders: [] as Order[],
        selectedOrder: null as Order | null,
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

        addOrderItem(categoryId: number, itemId: number, categories: Category[], selectedCustomer: any, selectedWaiter: any, selectedTable: any) {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return;
          
            const item = category.foods.find(f => f.id === itemId);
            if (!item) return;
          
            if (this.orders.length === 0 || !this.selectedOrder) {
              const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${Math.floor(Math.random() * 9000) + 1000}`;
              const orderTime = new Date().toISOString();
          
              const newOrder: Order = {
                order_number: orderNumber,
                order_status: "Pending",
                order_time: orderTime,
                items: [],
                customer_id: selectedCustomer?.id || null,
                waiter_id: selectedWaiter?.id || null,
                table_id: selectedTable?.id || null,
              };
          
              this.orders.push(newOrder);
              this.selectedOrder = newOrder;
            }
          
            const existingItemIndex = this.selectedOrder.items.findIndex(orderItem => orderItem.item === item.name);
            if (existingItemIndex > -1) {
              this.selectedOrder.items[existingItemIndex].quantity += 1;
            } else {
              this.selectedOrder.items.push({
                item: item.name,
                description: item.description,
                amount: item.price,
                quantity: 1,
                item_id: item.id,
                item_category_id: categoryId,
              });
            }
          },
          
          removeOrderItem(itemIndex: number) {
            if (this.selectedOrder) {
              this.selectedOrder.items.splice(itemIndex, 1);
            }
          },          
          reduceOrderItem(itemIndex: number) {
            if (this.selectedOrder && this.selectedOrder.items[itemIndex].quantity > 1) {
              this.selectedOrder.items[itemIndex].quantity -= 1;
            }
        
        },
        selectOrder(orderNumber) { 
            const order = this.orders.find(o => o.order_number === orderNumber);
            this.selectedOrder = order;
        },
        setOrderType(type) { 
            this.selectedOrder.order_type = type;
        },
        closeOrder(orderIndex) {
            this.orders[orderIndex].closed = true;
                    
        },
}});
