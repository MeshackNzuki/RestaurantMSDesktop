<template>
    <Table
        :headers="[
            'NO',
            'ITEM NAME',
            'CATEGORY',
            'SUPPLIER',
            'QUANTITY',
            'PRICE',
            'ACTION',
        ]"
        title="Inventory Items"
        v-model:query="searchQuery"
        :rows="itemsData?.length"
    >
        <template v-slot:actions>
            <SmallButton
                icon="pi pi-plus"
                classes="px-4"
                :action="() => showModal('addNewItem')"
            ></SmallButton>
            <Button icon="pi pi-print" class="mr-2" severity="secondary" />
            <Button icon="pi pi-upload" severity="secondary" />
        </template>

        <template v-slot:content>
            <tr v-for="(item, index) in items" :key="index">
                <td class="p-2 whitespace-nowrap">
                    <div class="text-start">{{ index + 1 }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ item.name }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ item.category?.name }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ item.supplier?.name }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="ttext-start">{{ item.quantity }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="ttext-start">{{ item.price }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-center">
                        <SmallButton
                            classes="border border-blue-500 border-dotted px-2 text-sm bg-red-500"
                            button-text="Edit"
                            :action="() => showModal(item.id)"
                        />
                    </div>
                </td>
            </tr>
        </template>
    </Table>

    <dialog id="addNewItem" class="modal modal-lg modal-bottom sm:modal-middle">
        <div
            class="modal-box dark:text-slate-400 dark:bg-sky-950 w-full max-w-5xl"
        >
            <h3 class="font-bold">Add New Item</h3>
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
                            <span class="mb-2 font-bold">Item Information</span>
                            <div>
                                <label
                                    for="itemName"
                                    class="block text-smtext-left"
                                    >Item Name</label
                                >
                                <input
                                    v-model="newItem.name"
                                    type="text"
                                    id="itemName"
                                    name="name"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter item name"
                                />
                                <span
                                    v-if="errors.name"
                                    class="text-red-500 text-sm"
                                    >{{ errors.name }}</span
                                >

                                <label
                                    for="category"
                                    class="block text-smtext-left"
                                    >Category</label
                                >
                                <input
                                    v-model="newItem.category"
                                    type="text"
                                    id="category"
                                    name="category"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter category"
                                />
                                <span
                                    v-if="errors.category"
                                    class="text-red-500 text-sm"
                                    >{{ errors.category }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-span-2 flex justify-end">
                        <CommonButton
                            button-text="Save Item"
                            :action="() => submitItemForm()"
                        />
                    </div>
                </form>
            </div>
        </div>
    </dialog>
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

const newItem = ref({
    name: "",
    category: "",
});

const errors = ref({});
const items = ref([]);

const searchQuery = ref("");

const submitItemForm = async () => {
    try {
        await axios.post("inventory/items", newItem.value);
        // handle success (e.g., show a success message or reload data)
    } catch (error) {
        // handle error (e.g., show error messages)
        errors.value = error.response.data.errors || {};
    }
};

onMounted(async () => {
    await axios.get("inventory/items").then((res) => {
        items.value = res.data.data;
    });
});
</script>

<style scoped>
/* Add your styles here */
</style>
