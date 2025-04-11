<template>

    <Table :headers="tableHeaders" title="Tables" search_placeholder="Search Table" :rows="tables.length">
        <template v-slot:content>
            <tr v-for="(table, index) in tables" :key="index">
                <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ table.name }}
                </td>
                <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {{ table.guest_number }}
                </td>
                <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {{ table.id }}
                </td>
                <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {{ table.zone.name }}
                </td>
                <td class="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                    <div class="flex space-x-2">
                        <CommonButton button-text="Edit"
                            :action="() => router.push(`/admin/tables/edit/${table.id}`)" />
                        <CommonButton button-text="Delete" :action="() => deleteTable(table.id)"
                            classes="bg-red-500 hover:bg-red-700" />
                    </div>
                </td>
            </tr>
        </template>
    </Table>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Table from "../../components/Tables/mainTable.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";

const router = useRouter();
const tables = ref([]);
const tableHeaders = [
    'Name',
    'Guest',
    'Status',
    'Location',
    'Actions'
];

const fetchTables = async () => {
    try {
        const response = await axios.get("/admin/tables");
        tables.value = response.data.data;
        console.log('tables', tables.value);
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
};

const getLocationName = async (locationId) => {
    try {
        const response = await axios.get(`/admin/zones/${locationId}`);
        return response.data.name;
    } catch (error) {
        console.error("Error fetching location name:", error);
        return '';
    }
};

const getStatus = async (tableId) => {
    try {
        const response = await axios.get(`/reservations/table/${tableId}`);
        const reservation = response.data;
        if (reservation) {
            const now = new Date();
            const resDate = new Date(reservation.res_date);
            const checkoutDate = new Date(reservation.checkout_date);
            if (now >= resDate && now <= checkoutDate) {
                return "Not available";
            }
        }
        return "Available";
    } catch (error) {
        console.error("Error fetching reservation status:", error);
        return "Available";
    }
};

const deleteTable = async (tableId) => {
    try {
        await axios.delete(`/admin/tables/${tableId}`);
        fetchTables();
    } catch (error) {
        console.error("Error deleting table:", error);
    }
};

onMounted(() => {
    fetchTables();
});
</script>
