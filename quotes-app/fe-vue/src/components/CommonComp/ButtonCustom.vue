<template>
  <v-btn color="primary" variant="text">
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ButtonCustom",
});
</script>
