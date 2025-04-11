<template></template>
<script setup>
import { useRouter } from "vue-router";
import { authStore } from "../stores/authStore";
const router = useRouter();
const { user } = authStore();
router.push("/" + user?.roles);
</script>
