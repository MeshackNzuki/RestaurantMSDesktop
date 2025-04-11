<template>
    <div class="bg-slate-100 dark:bg-sky-950 min-h-screen rounded-md">
        <div class="flex flex-wrap justify-around my-6 py-12 w-full gap-4">
            <StatCard label="All Students" quantity="1008" icon="pi pi-users" up="up"
                description="22 Admissions/2025" />
            <StatCard label="All Teachers" quantity="57" icon="pi pi-users" description="5% are BOM" />
            <StatCard label="All Staff" quantity="97" icon="pi pi-users" description="All Combined" />
            <StatCard description="Total this year" quantity="KES 700,000" />
            <StatCard label="Expenses" description="Total this year" quantity="KES 300,000" />
        </div>
        <div class="flex mt-4">
            <div class="w-full flex flex-col md:flex-row justify-evenly items-center">
                <div class="w-full flex flex-col justify-center items-center h-[30vh]">
                    <div class="flex flex-col gap-4 mb-4">
                        <div class="flex flex-row gap-4">
                            <SmallStatCard icon="pi pi-user-plus" label="Admissions" quantity="67" />

                            <SmallStatCard icon="pi pi-user-minus" label="Tranfers" quantity="7" />
                        </div>
                        <div class="flex flex-row gap-4">
                            <SmallStatCard icon="pi pi-clock" label="Allumni" quantity="567" />
                            <SmallStatCard icon="pi pi-user" label="Parents" quantity="7" />
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-4">
                        <div class="radial-progress shadow-lg opacity-90 bg-white text-orange-500" style="--value: 89"
                            role="progressbar">
                            89%
                        </div>
                        <div class="radial-progress shadow-lg opacity-90 bg-white text-emerald-500" style="--value: 70"
                            role="progressbar">
                            70%
                        </div>
                        <div class="radial-progress shadow-lg opacity-90 bg-white text-lime-500" style="--value: 40"
                            role="progressbar">
                            40%
                        </div>
                    </div>
                </div>
                <div class="w-full flex justify-center h-[30vh]">
                    <LineChart />
                </div>
                <div class="w-full flex justify-center h-[30vh]">
                    <DoughnutChart />
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
                    <router-link to="/admin/users">
                        <commonButton button-text="View All ..." />
                    </router-link>
                </CardMain>
                <div class="flex-1 h-full">
                    <BarChart />
                </div>

                <Calendar class="shadow-lg" inline showWeek />
            </div>
        </div>
    </div>
</template>
<script setup>
import StatCard from "../../components/Stats/Primary.vue";
import SmallStatCard from "../../components/Stats/Small.vue";
import Calendar from "primevue/calendar";
import BarChart from "../../components/Charts/BarChart.vue";
import LineChart from "../../components/Charts/LineChart.vue";
import DoughnutChart from "../../components/Charts/DoughnutChart.vue";
import CardMain from "../../components/Card/CardMain.vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import axios from "axios";

axios
    .post("/login", {
        username: "mesh",
        password: "12345678",
    })
    .then((res) => {
        console.log("res", res);
    })
    .catch((err) => {
        console.log("err", err);
    });
</script>
