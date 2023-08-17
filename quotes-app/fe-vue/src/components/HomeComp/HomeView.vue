<template>
  <PageHeading />
  <div class="container">
    <div class="row m-2">
      <div class="col-8">
        <HomeTabs :tag="tag" />
      </div>

      <div class="col-4">
        <HomeTags @onTagClicked="tagSelected" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PageHeading from "@/components/HomeComp/PageHeading.vue";
import HomeTabs from "@/components/HomeComp/HomeTabs.vue";
import HomeTags from "@/components/HomeComp/HomeTags.vue";
import { auth } from "@/utils/authHelpers";

export default defineComponent({
  name: "HomeView",
  components: {
    PageHeading,
    HomeTabs,
    HomeTags,
  },
  data() {
    return {
      tag: "",
    };
  },
  methods: {
    tagSelected(tag: string) {
      this.tag = tag;
    },
  },
  computed: {
    userName() {
      return auth.getUsername();
    },
  },
});
</script>
