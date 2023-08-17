<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary" align-tabs="center">
      <v-tab value="quotes">Quotes</v-tab>
      <v-tab v-if="isUserLoggedIn" value="author">Author</v-tab>
      <v-tab v-if="computedTag" value="tag">#{{ tag }}</v-tab>
    </v-tabs>

    <div class="center">
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="quotes"> <ShowQuotes /> </v-window-item>

          <v-window-item value="author"> <SearchBox /> </v-window-item>

          <v-window-item value="tag">
            <ShowQuotes :tag="tag" />
          </v-window-item>
        </v-window>
      </v-card-text>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ShowQuotes from "@/components/DisplayQuotes/ShowQuotes.vue";
import SearchBox from "@/components/SearchBox/SearchBox.vue";
import { helpers } from "@/utils/generalHelpers";

export default defineComponent({
  name: "HomeView",
  components: { ShowQuotes, SearchBox },
  props: {
    tag: { type: String, required: false, default: "" },
  },
  data: () => ({
    tab: "quotes",
  }),
  computed: {
    // a computed getter
    isUserLoggedIn() {
      return helpers.getUserLoggedIn();
    },
    computedTag() {
      if (this.tab === "tag") {
        return true;
      }
      return false;
    },
  },
  watch: {
    // Watches data changes
    tag() {
      this.tab = "tag";
    },
  },
});
</script>
