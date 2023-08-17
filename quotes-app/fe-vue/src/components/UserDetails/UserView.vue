<template><UserHeading /><UserTabs /></template>

<script lang="ts">
import { defineComponent } from "vue";
import UserHeading from "@/components/UserDetails/UserHeading.vue";
import UserTabs from "@/components/UserDetails/UserTabs.vue";
import { helpers } from "@/utils/generalHelpers";

export default defineComponent({
  name: "UserView",
  components: { UserHeading, UserTabs },
  beforeRouteEnter(to, from, next) {
    helpers.updateReactedQuotes();
    next();
  },
});
</script>
