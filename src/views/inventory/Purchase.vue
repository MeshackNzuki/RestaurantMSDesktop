<template>
    <Table
        :headers="[
            'NO',
            'PURCHASE NO',
            'SUPPLIER',
            'DATE',
            'STATUS',
            'TOTAL',
            'ACTION',
        ]"
        title="Levels / Classes"
        v-model:query="searchQuery"
        :rows="purchaseData?.length"
    >
        <template v-slot:actions>
            <SmallButton
                icon="pi pi-plus"
                classes="px-4"
                :action="() => showModal('addNewClass')"
            ></SmallButton>

            <Button icon="pi pi-print" class="mr-2" severity="secondary" />
            <Button icon="pi pi-upload" severity="secondary" />
        </template>

        <template v-slot:content>
            <tr v-for="(purchase, index) in purchases" :key="index">
                <td class="p-2 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="text-start">
                            {{ purchase.number }}
                        </div>
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ purchase.supplier?.name }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ purchase.created_at }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="ttext-start text-green-500">
                        {{ purchase.status }}
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="ttext-start text-green-500">
                        {{ purchase.total }}
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-center">
                        <SmallButton
                            classes="border border-blue-500 border-dotted px-2 text-sm bg-red-500"
                            button-text="Edit"
                            :action="() => showModal(purchase.id)"
                        />
                    </div>
                </td>
            </tr>

            <!-- Create fee structure -->
            <dialog
                id="addNewClass"
                class="modal modal-lg modal-bottom sm:modal-middle"
            >
                <div
                    class="modal-box dark:text-slate-400 dark:bg-sky-950 w-full max-w-5xl"
                >
                    <h3 class="font-bold">Add New Class</h3>
                    <p class="py-4 text-xs">Press ESC key to close</p>
                    <div class="modal-action flex justify-center">
                        <form method="dialog" class="flex flex-col gap-2">
                            <button
                                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            >
                                ✕
                            </button>

                            <div class="flex flex-col w-full lg:flex-row">
                                <div class="grid card rounded-sm p-1">
                                    <span class="mb-2 font-bold"
                                        >Level/Class Information</span
                                    >
                                    <div>
                                        <div class="">
                                            <label
                                                for="class"
                                                class="block text-smtext-left"
                                                >Class / Level / Year</label
                                            >
                                            <input
                                                v-model="newClass.level"
                                                type="number"
                                                id="class"
                                                name="level"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                                placeholder="Enter class"
                                            />
                                            <span
                                                v-if="errors.level"
                                                class="text-red-500 text-sm"
                                                >{{ errors.level }}</span
                                            >
                                        </div>
                                        <div class="">
                                            <label
                                                for="description"
                                                class="block text-smtext-left"
                                                >Description</label
                                            >
                                            <input
                                                v-model="newClass.description"
                                                type="text"
                                                id="description"
                                                name="description"
                                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                                placeholder="Enter description"
                                            />
                                            <span
                                                v-if="errors.description"
                                                class="text-red-500 text-sm"
                                                >{{ errors.description }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-2 flex justify-end">
                                <CommonButton
                                    button-text="Save Class"
                                    :action="() => submitClassForm()"
                                />
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const showModal = (modalId) => {
    document.getElementById(modalId).showModal();
};

const newClass = ref({
    level: "",
    description: "",
});

const newStream = ref({
    name: "",
    description: "",
});

const errors = ref({});
const purchases = ref({});

const searchQuery = ref("");

const submitStreamForm = async () => {
    try {
        await axios.post("admissions/streams", newStream.value);
        // handle success (e.g., show a success message or reload data)
    } catch (error) {
        // handle error (e.g., show error messages)
        errors.value = error.response.data.errors || {};
    }
};

const submitClassForm = async () => {
    try {
        await axios.post("admissions/levels", newClass.value);

        // handle success (e.g., show a success message or reload data)
    } catch (error) {
        // handle error (e.g., show error messages)
        errors.value = error.response.data.errors || {};
    }
};

onMounted(async () => {
    await axios.get("inventory/purchases").then((res) => {
        purchases.value = res.data.data;
    });
});
</script>

<style scoped>
/* Add your styles here */
</style>
