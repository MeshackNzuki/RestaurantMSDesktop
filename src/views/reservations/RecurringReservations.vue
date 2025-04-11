<template>
    <div>
        <Table :headers="tableHeaders" title="Recurring Reservations" search_placeholder="Search Reservation"
            :rows="reservations.length">
            <template v-slot:content>
                <tr v-for="(reservation, index) in reservations" :key="index">
                    <td
                        class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap uppercase dark:text-gray-500">
                        {{ reservation.user.name }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ reservation.user.tel_number }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ formatDate(reservation.res_date) }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ formatTime(reservation.res_date) }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ formatTime(reservation.checkout_date) }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ reservation.table.name }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ getLocationName(reservation.table.location_id) }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ reservation.guest_number }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ reservation.recurring ? 'Yes' : 'No' }}
                    </td>
                    <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">
                        {{ reservation.ref }}
                    </td>
                    <td class="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                        <div class="flex space-x-2">
                            <SmallButton v-if="!reservation.cancel" :action="() => cancelReservation(reservation.id)" />
                            <SmallButton v-else :action="() => uncancelReservation(reservation.id)" />
                            <SmallButton v-if="isSuperAdmin" :action="() => deleteReservation(reservation.id)" />
                        </div>
                    </td>
                </tr>
            </template>
        </Table>
    </div>
</template>
<script setup>
import Table from "../../components/Tables/mainTable.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import SmallButton from "../../components/Buttons/Small.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const toastPrime = useToast();

const showModal = (modalId) => {
    document.getElementById(modalId).showModal();
};
const refresh = ref(false)
const flashMessage = ref(null);

const tableHeaders = [
    'Name',
    'Phone',
    'Date',
    'Time In',
    'Time Out',
    'Table',
    'Location',
    'Guests',
    'Recurring',
    'Reference',
    'Actions'
];

const reservations = ref([]);
const isSuperAdmin = ref(false);

const fetchReservations = async () => {
    try {
        const response = await axios.get("/api/reservations/recurring");
        reservations.value = response.data;
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString();
};

const getLocationName = async (locationId) => {
    try {
        const response = await axios.get(`/api/locations/${locationId}`);
        return response.data.name;
    } catch (error) {
        console.error("Error fetching location name:", error);
        return '';
    }
};

const cancelReservation = async (reservationId) => {
    try {
        await axios.post(`/admin/reservations/cancel/${reservationId}`);
        fetchReservations();
    } catch (error) {
        console.error("Error canceling reservation:", error);
    }
};

const uncancelReservation = async (reservationId) => {
    try {
        await axios.post(`/admin/reservations/uncancel/${reservationId}`);
        fetchReservations();
    } catch (error) {
        console.error("Error uncanceling reservation:", error);
    }
};

const deleteReservation = async (reservationId) => {
    try {
        await axios.delete(`/admin/reservations/${reservationId}`);
        fetchReservations();
    } catch (error) {
        console.error("Error deleting reservation:", error);
    }
};

onMounted(() => {
    fetchReservations();
    // Check if the user is a super admin
    isSuperAdmin.value = true; // Replace with actual logic to check if the user is a super admin
});
</script>
