<template>
    <Table
        :headers="[
            'SUPPLIER NAME',
            'CONTACT PERSON',
            'PHONE',
            'EMAIL',
            'STATUS',
            'ACTION',
        ]"
        title="All Suppliers"
        v-model:query="searchQuery"
        :rows="suppliers?.length"
    >
        <template v-slot:actions>
            <SmallButton
                icon="pi pi-plus"
                :action="() => showModal('addSupplier')"
            ></SmallButton>

            <Button icon="pi pi-print" class="mr-2" severity="secondary" />
            <Button icon="pi pi-upload" severity="secondary" />
        </template>
        <template v-slot:content>
            <tr v-for="(supplier, index) in suppliers" :key="index">
                <td class="p-2 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="text-start">
                            {{ supplier.name }}
                        </div>
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-left">{{ supplier.contact_person }}</div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="ttext-start text-green-500">
                        {{ supplier.phone }}
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="ttext-start text-green-500">
                        {{ supplier.email }}
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap">
                    <div class="text-lg text-center">
                        <p class="text-center">
                            <i
                                :class="[
                                    'pi',
                                    supplier.status === 'Active'
                                        ? 'pi-check-circle text-green-500'
                                        : 'pi-times-circle text-red-400',
                                ]"
                            ></i>
                        </p>
                    </div>
                </td>
                <td class="p-2 whitespace-nowrap flex flex-row gap-1">
                    <div class="text-lg text-center">
                        <SmallButton
                            classes="border border-blue-500 border-dotted px-2 text-sm bg-yellow"
                            button-text="Edit"
                            :action="() => showModal(supplier.id)"
                        />
                    </div>
                    <div class="text-lg text-center">
                        <SmallButton
                            classes="border border-blue-500 border-dotted px-2 text-sm bg-red-500"
                            button-text="Del"
                            :action="() => deleteSupplier(supplier.id)"
                        />
                    </div>
                </td>

                <dialog :id="supplier.id" class="modal">
                    <div class="modal-box dark:bg-slate-800">
                        <Error :msg="ErrorObjectMessage" />
                        <form method="dialog" class="modal-backdrop">
                            <button
                                class="btn btn-sm btn-circle btn-gray-600 absolute right-2 top-2"
                            >
                                ✕
                            </button>
                        </form>
                        <h3 class="text-lg font-bold">
                            Edit Supplier - {{ supplier.name }}
                        </h3>
                        <form @submit.prevent="updateSupplier(supplier.id)">
                            <div class="mt-4">
                                <label
                                    for="supplier_name"
                                    class="block text-smtext-left"
                                    >Supplier Name</label
                                >
                                <input
                                    v-model="editInputs.name"
                                    type="text"
                                    id="supplier_name"
                                    required
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter supplier name"
                                />
                            </div>
                            <div class="mt-4">
                                <label
                                    for="contact_person"
                                    class="block text-smtext-left"
                                    >Contact Person</label
                                >
                                <input
                                    v-model="editInputs.contact_person"
                                    type="text"
                                    id="contact_person"
                                    required
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter contact person"
                                />
                            </div>
                            <div class="mt-4">
                                <label
                                    for="phone"
                                    class="block text-smtext-left"
                                    >Phone</label
                                >
                                <input
                                    v-model="editInputs.phone"
                                    type="text"
                                    id="phone"
                                    required
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div class="mt-4">
                                <label
                                    for="email"
                                    class="block text-smtext-left"
                                    >Email</label
                                >
                                <input
                                    v-model="editInputs.email"
                                    type="email"
                                    id="email"
                                    required
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div class="mt-4">
                                <label
                                    for="status"
                                    class="block text-smtext-left"
                                    >Status</label
                                >
                                <select
                                    v-model="editInputs.status"
                                    id="status"
                                    required
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="modal-action flex justify-center mt-4">
                                <CommonButton
                                    button-text="Update Supplier"
                                    type="submit"
                                />
                            </div>
                        </form>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </tr>
            <!-- create supplier -->
            <dialog id="addSupplier" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box dark:text-slate-400 dark:bg-sky-950">
                    <h3 class="font-bold text-lg">Add New Supplier</h3>
                    <form @submit.prevent="addSupplier">
                        <div class="mt-4">
                            <label
                                for="supplier_name"
                                class="block text-smtext-left"
                                >Supplier Name</label
                            >
                            <input
                                v-model="createInputs.name"
                                type="text"
                                id="supplier_name"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                placeholder="Enter supplier name"
                            />
                        </div>
                        <div class="mt-4">
                            <label
                                for="contact_person"
                                class="block text-smtext-left"
                                >Contact Person</label
                            >
                            <input
                                v-model="createInputs.contact_person"
                                type="text"
                                id="contact_person"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                placeholder="Enter contact person"
                            />
                        </div>
                        <div class="mt-4">
                            <label for="phone" class="block text-smtext-left"
                                >Phone</label
                            >
                            <input
                                v-model="createInputs.phone"
                                type="text"
                                id="phone"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div class="mt-4">
                            <label for="email" class="block text-smtext-left"
                                >Email</label
                            >
                            <input
                                v-model="createInputs.email"
                                type="email"
                                id="email"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                                placeholder="Enter email address"
                            />
                        </div>
                        <div class="mt-4">
                            <label for="status" class="block text-smtext-left"
                                >Status</label
                            >
                            <select
                                v-model="createInputs.status"
                                id="status"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="modal-action flex justify-center">
                            <CommonButton
                                button-text="Create Supplier"
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </template>
    </Table>
</template>

<script setup>
import Table from "../../components/Tables/mainTable.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import SmallButton from "../../components/Buttons/Small.vue";
import Error from "../../components/Flash/Error.vue";
import Success from "../../components/Flash/Success.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useToast } from "primevue/usetoast";
import { ref, onMounted, watch } from "vue";

// Initializing refs for the page's data and functionalities
const status = ref("student");
const toastPrime = useToast();
const student_issue_admission = ref();
const staff_issue_number = ref();

const suppliers = ref([]); // Ref for suppliers data
const pagination = ref({});
const links = ref([]);
const searchQuery = ref("");
const reload = ref(false);
const supplier_edit_id = ref(null);
const supplier_edit_name = ref("");
const supplier_issue_id = ref(null);
const supplier_issue_name = ref("");
const createInputs = ref({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
});
const ErrorObjectMessange = ref("");

// Functions to show and hide modals
const showModal = (modalId) => {
    document.getElementById(modalId).showModal();
};

const hideModal = (modalId) => {
    document.getElementById(modalId).close();
};

// Function to fetch supplier data from the API
const fetchData = () => {
    const showLoader = searchQuery.value.trim() === "";

    axios
        .get(`/inventory/suppliers?query=${searchQuery.value}`, {
            showLoader: showLoader,
        })
        .then((response) => {
            pagination.value = response.data;
            links.value = response.data.links;
            suppliers.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

// Mounted lifecycle hook to load data initially
onMounted(() => {
    fetchData();
});

// Watcher to refetch data when searchQuery or reload changes
watch([searchQuery, reload], () => {
    fetchData();
});

// Function to handle form submission for creating a new supplier
const addSupplier = () => {
    if (
        !createInputs.value.name ||
        !createInputs.value.contact_person ||
        !createInputs.value.phone ||
        !createInputs.value.email ||
        !createInputs.value.address ||
        !createInputs.value.city ||
        !createInputs.value.country
    ) {
        toast.error("Please fill all the fields");
        return;
    }
    axios
        .post("/inventory/supplier/create", createInputs.value)
        .then((response) => {
            toast.success("Supplier Created Successfully");
            reload.value = !reload.value;
        })
        .catch((error) => {
            toast.error(error.message);
        });
    createInputs.value = {
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        country: "",
    };
};
</script>
