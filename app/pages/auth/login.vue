<script setup lang="ts">
import LoginView from "~/components/view/Auth/login/LoginView.vue";

// import LoginView from "~/components/view/Auth/login/LoginView.vue";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Chef Login - FoodHub Kitchen",
  meta: [
    {
      name: "description",
      content:
        "Login to FoodHub Kitchen to manage your culinary creations with ease.",
    },
  ],
});
</script>

<template>
  <LoginView />
</template>
