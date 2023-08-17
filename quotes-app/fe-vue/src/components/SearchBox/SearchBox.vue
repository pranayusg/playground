<template>
  <div class="center">
    <v-autocomplete
      v-model="value"
      label="Authors"
      :items="authors"
      variant="outlined"
      class="searchbox"
    ></v-autocomplete>
    <ShowQuotes v-if="value" :author="value" />
  </div>
</template>

<script lang="ts">
import { getAuthors } from "@/apis/protectedRoutes";
import { Author } from "@/interfaces/types";
import { defineComponent } from "vue";
import ShowQuotes from "@/components/DisplayQuotes/ShowQuotes.vue";

export default defineComponent({
  name: "SearchBox",
  components: { ShowQuotes },
  data: () => ({
    value: "",
    authors: [] as string[],
  }),
  methods: {
    async fetchAuthors() {
      const jsonData = await getAuthors();
      if (jsonData.length)
        jsonData.forEach((element: Author) => {
          this.authors.push(element.author);
        });
    },
  },
  created() {
    this.fetchAuthors();
  },
});
</script>

<style scoped>
.searchbox {
  margin-top: 1.5%;
}
</style>
