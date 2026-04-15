<script setup lang="ts">
import RegisterView from "~/components/view/Auth/register/registerView.vue";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Chef Register - FoodHub Kitchen",
  meta: [
    {
      name: "description",
      content:
        "Register to FoodHub Kitchen to manage your culinary creations with ease.",
    },
  ],
});
</script>

<template>
  <RegisterView />
</template>
