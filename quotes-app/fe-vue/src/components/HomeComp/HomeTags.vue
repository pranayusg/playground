<template>
  <div v-if="tags.length" class="sidebar">
    <p>Popular Tags</p>
    <div class="tag-list">
      <a
        v-for="(tag, index) in tags"
        :key="index"
        href="#"
        class="tag-pill"
        :onClick="(e: any) => tagClicked(e.target.innerText)"
      >
        {{ tag }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { getAllTags } from "@/apis/openRoutes";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeTags",
  data() {
    return {
      tags: [],
    };
  },
  methods: {
    async fetchTags() {
      const jsonData = await getAllTags();
      if (jsonData.length) this.tags = jsonData.slice(0, 4);
    },
    tagClicked(tag: string) {
      // Child-Parent communication
      this.$emit("onTagClicked", tag);
    },
  },
  created() {
    this.fetchTags();
  },
});
</script>

<style scoped>
.sidebar {
  margin: 10% 1% 1%;
  /* width: 50%; */
  padding: 5px 10px 10px;
  background: #f3f3f3;
  border-radius: 4px;
  display: inline-block;
}

p .sidebar {
  margin-bottom: 1rem;
}

.tag-pill {
  color: #fff;
  font-size: 0.8rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  white-space: nowrap;
  margin-right: 5px;
  margin-bottom: 0.2rem;
  display: inline-block;
  background-color: #818a91;
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
  text-decoration: none;
}
</style>
