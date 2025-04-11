<template>
    <div class="bg-slate-100 dark:bg-transparent min-h-screen">
        <div class="flex flex-wrap justify-around my-6 py-12 w-full gap-4">
            <StatCard />
            <StatCard />
            <StatCard />
            <StatCard />
            <StatCard />
        </div>
        <div class="flex mt-4">
            <div class="w-full flex flex-col md:flex-row justify-around items-center">
                <div class="w-full md:w-1/4 flex justify-center h-[40vh]">
                    <DoughnutChart />
                </div>
                <div class="w-full md:w-1/4 flex justify-center h-[40vh]">
                    <LineChart />
                </div>
                <div class="w-full md:w-2/4 flex justify-center h-[40vh]">
                    <BarChart />
                </div>
            </div>
        </div>
        <div class="flex mt-4">
            <div class="w-full flex flex-col md:flex-row justify-around items-center gap-4">
                <CardMain title="Department users">
                    <ul class="food rounded-box w-full">
                        <li>
                            <details close>
                                <summary>Admissions</summary>
                                <ul>
                                    <li><a>Subfood 1</a></li>
                                    <li><a>Subfood 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details close>
                                <summary>Finance</summary>
                                <ul>
                                    <li><a>Subfood 1</a></li>
                                    <li><a>Subfood 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details close>
                                <summary>Transport</summary>
                                <ul>
                                    <li><a>Subfood 1</a></li>
                                    <li><a>Subfood 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details close>
                                <summary>Parent</summary>
                                <ul>
                                    <li><a>Subfood 1</a></li>
                                    <li><a>Subfood 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details close>
                                <summary>Parent</summary>
                                <ul>
                                    <li><a>Subfood 1</a></li>
                                    <li><a>Subfood 2</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                    <commonButton button-text="View All ..."></commonButton>
                </CardMain>
                <CardMain title="Upcoming Events">
                    <ul class="food rounded-box w-full">
                        <li>Event 1</li>
                        <li>Event 2</li>
                        <li>Event 1</li>
                        <li>Event 1</li>
                        <li>Event 1</li>
                        <li>Event 1</li>
                        <li>Event 1</li>
                        <li>Event 1</li>
                        <li>Event 1</li>
                    </ul>

                    <commonButton button-text="View All ..."></commonButton>
                </CardMain>

                <Calendar class="shadow-lg" inline showWeek />
            </div>
        </div>
    </div>
</template>
<script setup>
import StatCard from "../../components/Stats/Primary.vue";
import Calendar from "primevue/calendar";
import BarChart from "../../components/Charts/BarChart.vue";
import LineChart from "../../components/Charts/LineChart.vue";
import DoughnutChart from "../../components/Charts/DoughnutChart.vue";
import CardMain from "../../components/Card/CardMain.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
</script>
