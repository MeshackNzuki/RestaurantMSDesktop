<template>
    <div>
        <Table :headers="tableHeaders" title="Zone Reservations" search_placeholder="Search Reservation"
            :rows="reservations.length">
            <template v-slot:actions>
                <SmallButton icon="pi pi-plus" buttonText='Add New' :action="() => showModal('ReservationModal')">
                    Add New Reservation
                </SmallButton>
            </template>
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
        <dialog id="ReservationModal" class="modal modal-lg">

            <div class="modal-box dark:text-slate-400 dark:bg-sky-950">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg">Add New Zone Reservation</h3>
                <p class="py-4 text-xs">Press ESC key to close</p>
                <div class="modal-ction">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="mb-4">
                            <label for="name" class="block text-sm font-semibold">Name</label>
                            <input v-model="newReservation.name" type="text" id="name" placeholder="Name"
                                class="p-2 border border-gray-300 rounded-lg" />
                        </div>

                        <div class="mb-4">
                            <label for="phone" class="block text-sm font-semibold">Phone</label>
                            <input v-model="newReservation.phone" type="text" id="phone" placeholder="Phone"
                                class="p-2 border border-gray-300 rounded-lg" />
                        </div>

                        <div class="mb-4">
                            <label for="date" class="block text-sm font-semibold">Reservation Date</label>
                            <input v-model="newReservation.date" type="date" id="date" placeholder="Date"
                                class="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>

                        <div class="mb-4">
                            <label for="timeIn" class="block text-sm font-semibold">Time In</label>
                            <input v-model="newReservation.timeIn" type="time" id="timeIn" placeholder="Time In"
                                class="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>

                        <div class="mb-4">
                            <label for="timeOut" class="block text-sm font-semibold">Time Out</label>
                            <input v-model="newReservation.timeOut" type="time" id="timeOut" placeholder="Time Out"
                                class="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>


                        <div class="mb-4">
                            <label for="zone" class="block text-sm font-semibold">Zone</label>
                            <select v-model="newReservation.zone" id="zone"
                                class="w-full p-2 border border-gray-300 rounded-lg">
                                <option v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label for="guests" class="block text-sm font-semibold">Guests</label>
                            <input v-model="newReservation.guests" type="number" id="guests" placeholder="Guests"
                                class="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>

                    </div>
                    <div class="flex justify-end mt-4 gap-4 w-full">
                        <CommonButton button-text="Save" classes="bg-green-500 hover:bg-green-700"
                            @click="saveReservation" />
                        <CommonButton button-text="Cancel" classes="bg-red-500 hover:bg-red-700"
                            @click="closeModal('ReservationModal')" />
                    </div>
                </div>
            </div>

        </dialog>
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

const closeModal = (modalId) => {
    document.getElementById(modalId).close();
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
const zones = ref([]);
const isSuperAdmin = ref(false);

const newReservation = ref({
    name: "",
    phone: "",
    date: "",
    timeIn: "",
    timeOut: "",
    zone: "",
    guests: 0,
});

const fetchReservations = async () => {
    try {
        const response = await axios.get("/admin/table-reservations");
        reservations.value = response.data.data;
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
};

const fetchTables = async () => {
    try {
        const response = await axios.get("/admin/tables");
        tables.value = response.data.data;
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
};

const fetchZones = async () => {
    try {
        const response = await axios.get("/admin/zones");
        zones.value = response.data.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
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
        const response = await axios.get(`/admin/zones/${locationId}`);
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

const addReservation = async () => {
    try {
        const response = await axios.post("/admin/table-reservations", newReservation.value);
        if (response.data.success) {
            fetchReservations();
            closeModal('ReservationModal');
            toastPrime.add({
                severity: "success",
                summary: "Reservation Added",
                detail: 'New reservation added successfully',
                life: 3000,
            });
        }
    } catch (error) {
        console.error("Error adding reservation:", error);
        toastPrime.add({
            severity: "error",
            summary: "Error",
            detail: 'Error adding reservation',
            life: 3000,
        });
    }
};

onMounted(() => {
    fetchReservations();
    fetchTables();
    fetchZones();
    // Check if the user is a super admin
    isSuperAdmin.value = true; // Replace with actual logic to check if the user is a super admin
});
</script>
