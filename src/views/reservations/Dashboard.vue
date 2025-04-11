<template>
    <div class="bg-slate-100 dark:bg-sky-950 min-h-screen rounded-md">
        <div class="flex flex-wrap justify-around my-6 py-12 w-full gap-4">
            <StatCard label="Total Customers" :quantity="tables?.total_customers" icon="pi pi-users" up="up"
                description="22 Admissions/2025" />
            <StatCard label="Total bookings" :quantity="tables?.total_bookings" icon="pi pi-users"
                description="5% are BOM" />
            <StatCard label="Today's bookings" :quantity="tables?.todays_bookings" icon="pi pi-users"
                description="All Combined" />
            <StatCard description="Upcoming bookings" :quantity="tables?.upcoming_bookings" />
        </div>
        <div class="w-full flex justify-between items-center px-6">
            <div class="flex">
                <div class="flex items-center mr-4 ">
                    <div class="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-600 to bg-emerald-400 mr-2">
                    </div>
                    <div class="dark:text-white ml-2">Available</div>
                </div>
                <div class="flex items-center ml-2">
                    <div class="h-6 w-6 rounded-full bg-gradient-to-r from-red-500  to-rose-600 mr-2"></div>
                    <div class="dark:text-white ml-2">Reserved</div>
                </div>
            </div>
        </div>
        <div class="px-6">
            <div v-for="zone in zones" class="  mt-6 mb-6">
                <h4 class="dark:text-white font-bold mb-2">{{ zone.name }}</h4>
                <hr>
                <div class="flex flex-wrap w-full justify-center">
                    <div v-for="table in tables.tables" :key="zone.id">
                        <span v-if="table.zone?.name == zone.name">
                            <span class="m-2 flex justify-center rounded-3xl items-center px-4 py-2 text-white"
                                :class="getReservationStatus(table.has_reservation_on_date)"
                                style="height:70px; width:90px">
                                <strong>{{ table.name }}</strong>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatCard from "../../components/Stats/Primary.vue";
import axios from "axios";

const tables = ref([]);
const zones = ref([]);

const getReservationStatus = (reservations) => {
    if (reservations) {
        return "bg-gradient-to-r from-red-500  to-rose-600  ";
    } else {
        return "bg-gradient-to-r from-emerald-600 to bg-emerald-400";
    }
};

onMounted(async () => {
    try {
        const response = await axios.get("/admin/zones");
        zones.value = response.data.data;       
    } catch (error) {
        console.error("Error fetching zones:", error);
    }
    try {
        const response = await axios.get("/admin/tables");
        tables.value = response.data.data;      
    } catch (error) {
       
    }
});
</script>
