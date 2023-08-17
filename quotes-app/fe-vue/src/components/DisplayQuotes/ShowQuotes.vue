<template>
  <div v-if="quotes.length">
    <!-- Kebab case -->
    <card-item
      v-for="quote in quotes.slice(minPageValue, maxPageValue)"
      :key="quote.id"
      :quoteId="quote.id"
      :created_at="quote.created_at"
      :quote="quote.quote"
      :author="quote.author"
      :tags="quote.tags"
      :likes="quote.likes"
      :dislikes="quote.dislikes"
      :userName="quote.user.userName"
      :showEditDelete="myQuotes"
    />
    <v-pagination
      v-if="pageCount > 1"
      v-model="page"
      :length="pageCount"
      @click="handlePageChange"
    ></v-pagination>
  </div>
  <div v-else>No data</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardItem from "@/components/DisplayQuotes/CardItem.vue";
import { getQuotesByTag } from "@/apis/openRoutes";
import { searchQuotesByAuthor } from "@/apis/protectedRoutes";
import { FavQuote, QuoteDetailed } from "@/interfaces/types";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "ShowQuotes",
  components: {
    CardItem,
  },
  props: {
    author: { type: String, required: false, default: "" },
    tag: { type: String, required: false, default: "" },
    myQuotes: { type: Boolean, required: false, default: false },
    favorite: { type: Boolean, required: false, default: false },
    disliked: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 5,
      minPageValue: 0,
      maxPageValue: 5,
      quotesList: [] as QuoteDetailed[],
    };
  },
  watch: {
    // Watches data changes
    author() {
      this.fetchQuotesByAuthor();
    },
    tag() {
      this.fetchQuotesByTag();
    },
  },
  methods: {
    async fetchQuotesByAuthor() {
      const jsonData = await searchQuotesByAuthor(this.author);
      if (jsonData.length) this.quotesList = jsonData;
    },
    async fetchQuotesByTag() {
      const jsonData = await getQuotesByTag(this.tag);
      if (jsonData.length) this.quotesList = jsonData;
    },
    handlePageChange() {
      if (this.page <= 1) {
        this.minPageValue = 0;
        this.maxPageValue = 5;
      } else {
        if (this.minPageValue === this.page * this.itemsPerPage) {
          this.maxPageValue = this.minPageValue;
          this.minPageValue = this.minPageValue - this.itemsPerPage;
        } else {
          this.minPageValue = this.maxPageValue;
          this.maxPageValue = this.page * this.itemsPerPage;
        }
      }
      if (this.minPageValue === this.maxPageValue) this.handlePageChange();
    },
  },
  computed: {
    // eslint-disable-next-line
    pageCount(): number {
      return Math.ceil(this.quotes.length / this.itemsPerPage);
    },
    quotes(): QuoteDetailed[] {
      const userStore = useUserStore();

      const quotes = [] as QuoteDetailed[];
      if (this.myQuotes) return userStore.myQuotes;
      else if (this.author) return this.quotesList;
      else if (this.tag) return this.quotesList;
      else if (this.favorite)
        userStore.likedQuotes.forEach((likedQuote: FavQuote) =>
          quotes.push(likedQuote.quote)
        );
      else if (this.disliked)
        userStore.dislikedQuotes.forEach((dislikedQuote: FavQuote) =>
          quotes.push(dislikedQuote.quote)
        );
      else {
        if (userStore.allQuotes.length === 0) userStore.fetchAllQuotes();
        return userStore.allQuotes;
      }
      return quotes;
    },
  },
  created() {
    if (this.author) this.fetchQuotesByAuthor();
    if (this.tag) this.fetchQuotesByTag();
  },
});
</script>
