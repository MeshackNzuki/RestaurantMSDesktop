<template>
    <Table
        :headers="['NO', 'CATEGORY NAME', 'DESCRIPTION', 'ACTION']"
        title="Item Categories"
        v-model:query="searchQuery"
        :rows="categoriesData?.length"
    >
        <template v-slot:actions>
            <SmallButton
                icon="pi pi-plus"
                classes="px-4"
                :action="() => showModal('addNewCategory')"
            ></SmallButton>
            <Button icon="pi pi-print" class="mr-2" severity="secondary" />
            <Button icon="pi pi-upload" severity="secondary" />
        </template>

        <template v-slot:content>
            <tr v-for="(category, index) in categories" :key="index">
                <td class="p-2 whitespace-nowrap">
                    <div class="text-start">{{ index + 1 }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ category.name }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ category.description }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-center">
                        <SmallButton
                            classes="border border-blue-500 border-dotted px-2 text-sm bg-red-500"
                            button-text="Edit"
                            :action="() => showModal(category.id)"
                        />
                    </div>
                </td>
            </tr>
        </template>
    </Table>

    <!-- Add New Category Modal -->
    <dialog
        id="addNewCategory"
        class="modal modal-lg modal-bottom sm:modal-middle"
    >
        <div
            class="modal-box dark:text-slate-400 dark:bg-sky-950 w-full max-w-5xl"
        >
            <h3 class="font-bold">Add New Category</h3>
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
                                >Category Information</span
                            >
                            <div>
                                <label
                                    for="categoryName"
                                    class="block text-smtext-left"
                                    >Category Name</label
                                >
                                <input
                                    v-model="newCategory.name"
                                    type="text"
                                    id="categoryName"
                                    name="name"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter category name"
                                />
                                <span
                                    v-if="errors.name"
                                    class="text-red-500 text-sm"
                                    >{{ errors.name }}</span
                                >

                                <label
                                    for="categoryDescription"
                                    class="block text-smtext-left"
                                    >Description</label
                                >
                                <input
                                    v-model="newCategory.description"
                                    type="text"
                                    id="categoryDescription"
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
                    <div class="col-span-2 flex justify-end">
                        <CommonButton
                            button-text="Save Category"
                            :action="() => submitCategoryForm()"
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

const newCategory = ref({
    name: "",
    description: "",
});

const errors = ref({});

const categories = ref([]);

const searchQuery = ref("");

const submitCategoryForm = async () => {
    try {
        await axios.post("inventory/categories", newCategory.value);
        // handle success (e.g., show a success message or reload data)
    } catch (error) {
        errors.value = error.response.data.errors || {};
    }
};

onMounted(async () => {
    await axios.get("inventory/categories").then((res) => {
        categories.value = res.data.data;
    });
});
</script>

<style scoped>
/* Add your styles here */
</style>
