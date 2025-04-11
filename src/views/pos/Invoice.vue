<template>
    <Table :headers="[
        'STUDENT ADM',
        'STUDENT NAME',
        'DESCRIPTION',
        'AMOUNT',
        'ACTION',
    ]" title="Fees Payment" v-model:query="searchQuery" :rows="paymentData?.length">
        <template v-slot:actions>
            <SmallButton icon="pi pi-plus" classes="px-4" :action="() => showModal('addPayment')"></SmallButton>

            <Button icon="pi pi-print" class="mr-2" severity="secondary" />
            <Button icon="pi pi-upload" severity="secondary" />
        </template>

        <template v-slot:content>
            <tr v-for="(payment, index) in paymentData" :key="index">
                <td class="p-2 whitespace-nowrap">
                    <div class="text-start">{{ payment.student_adm }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ payment.student_name }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ payment.description }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-righttext-left text-green-500">
                        ${{ payment.amount?.toFixed(2) }}
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-center">
                        <SmallButton classes="border border-blue-500 border-dotted px-2 text-sm bg-red-500"
                            button-text="Edit" :action="() => showModal(payment.id)" />
                    </div>
                </td>
            </tr>

            <!-- Add payment -->
            <dialog id="addPayment" class="modal modal-lg modal-bottom sm:modal-middle">
                <div class="modal-box dark:text-slate-400 dark:bg-sky-950 w-full max-w-5xl">
                    <h3 class="font-bold">Add New Payment</h3>
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="modal-action flex justify-center flex justify-center">
                        <form method="dialog" class="flex flex-col gap-2">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                            </button>

                            <div class="flex flex-col w-full lg:flex-row">
                                <div class="grid card rounded-sm p-1">
                                    <span class="mb-2 font-bold">Payment Information</span>
                                    <div>
                                        <div class="col-span-2">
                                            <label for="student_adm" class="block text-smtext-left">Student
                                                Admission</label>
                                            <input v-model="paymentForm.student_adm
                                                " type="text" id="student_adm" name="student_adm"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                                placeholder="Enter student admission number" />
                                            <span v-if="errors.student_adm" class="text-red-500 text-sm">{{
                                                errors.student_adm }}</span>
                                        </div>
                                        <div class="col-span-2">
                                            <label for="description" class="block text-smtext-left">Description</label>
                                            <input v-model="paymentForm.description
                                                " type="text" id="description" name="description"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                                placeholder="Enter payment description" />
                                            <span v-if="errors.description" class="text-red-500 text-sm">{{
                                                errors.description }}</span>
                                        </div>
                                        <div class="col-span-2">
                                            <label for="amount" class="block text-smtext-left">Amount</label>
                                            <input v-model.number="paymentForm.amount
                                                " type="number" id="amount" name="amount"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                                placeholder="Enter amount" />
                                            <span v-if="errors.amount" class="text-red-500 text-sm">{{ errors.amount
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-2 flex justify-end">
                                <CommonButton button-text="Save" :action="() => submitPayment()" />
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        </template>
    </Table>
</template>

<script setup>
import Table from "../../components/Tables/mainTable.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import SmallButton from "../../components/Buttons/Small.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const showModal = (modalId) => {
    document.getElementById(modalId).showModal();
};

const paymentData = ref([]);
const paymentForm = ref({
    student_adm: "",
    description: "",
    amount: 0,
});
const errors = ref({});
const searchQuery = ref("");

const submitPayment = async () => {
    try {
        await axios.post(
            "/finance/make-payment" + student_id,
            paymentForm.value,
        );
        // handle success (e.g., show a success message or reload data)
        paymentForm.value = { student_adm: "", description: "", amount: 0 }; // Clear form
    } catch (error) {
        // handle error (e.g., show error messages)
        errors.value = error.response.data.errors || {};
    }
};

onMounted(async () => {
    try {
        const response = await axios.get("/finance/payment-history");
        paymentData.value = response.data;
    } catch (error) {
        console.error("Failed to fetch payment data:", error);
    }
});
</script>

<style scoped>
/* Add your styles here */
</style>
