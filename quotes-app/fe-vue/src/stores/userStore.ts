import { getQuotes } from "@/apis/openRoutes";
import {
  getMyQuotes,
  getMyUnfavQuotes,
  getMyfavQuotes,
} from "@/apis/protectedRoutes";
import { auth } from "@/utils/authHelpers";
import { defineStore } from "pinia";

export const useUserStore = defineStore("users", {
  state: () => ({
    userLoggedIn: false,
    allQuotes: [],
    myQuotes: [],
    likedQuotes: [],
    dislikedQuotes: [],
    expirationTime: 0,
  }),
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async loginUser(userData: any) {
      this.setTimer();
      auth.setAuthValues(userData);
      this.userLoggedIn = true;
      this.fetchQuotes();
    },
    async loginUserFromToken() {
      this.setTimer();
      this.userLoggedIn = true;
      this.fetchQuotes();
    },
    logoutUser() {
      auth.clearSession();
      this.userLoggedIn = false;
      this.allQuotes = [];
      this.myQuotes = [];
      this.likedQuotes = [];
      this.dislikedQuotes = [];
    },
    async fetchQuotes() {
      const allQuotesData = await getQuotes();
      const myQuotesData = await getMyQuotes();
      const quotesFavData = await getMyfavQuotes();
      const quotesUnFavData = await getMyUnfavQuotes();

      this.allQuotes = allQuotesData;
      this.myQuotes = myQuotesData;
      this.likedQuotes = quotesFavData;
      this.dislikedQuotes = quotesUnFavData;
    },
    async fetchAllQuotes() {
      const allQuotesData = await getQuotes();
      this.allQuotes = allQuotesData;
    },
    async setTimer() {
      // 1hr
      this.expirationTime = 1000 * 60 * 60;
      setTimeout(() => {
        this.logoutUser();
        this.expirationTime = 0;
      }, this.expirationTime);
    },
  },
});
