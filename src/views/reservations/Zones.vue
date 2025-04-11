<template>

    <Table :headers="tableHeaders" title="Zones" search_placeholder="Search Zone" :rows="zones.length">
        <template v-slot:content>
            <tr v-for="(zone, index) in zones" :key="index">
                <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {{ zone.name }}
                </td>
                <td class="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {{ zone.description }}
                </td>
                <td class="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                    <div class="flex space-x-2">
                        <CommonButton button-text="Edit" :action="() => router.push(`/admin/zones/edit/${zone.id}`)" />
                        <CommonButton button-text="Delete" :action="() => deleteZone(zone.id)"
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
const zones = ref([]);
const tableHeaders = [
    'Name',
    'Description',
    'Actions'
];

const fetchZones = async () => {
    try {
        const response = await axios.get("/admin/zones");
        zones.value = response.data.data;
    } catch (error) {
        console.error("Error fetching zones:", error);
    }
};

const deleteZone = async (zoneId) => {
    try {
        await axios.delete(`/admin/zones/${zoneId}`);
        fetchZones();
    } catch (error) {
        console.error("Error deleting zone:", error);
    }
};

onMounted(() => {
    fetchZones();
});
</script>
