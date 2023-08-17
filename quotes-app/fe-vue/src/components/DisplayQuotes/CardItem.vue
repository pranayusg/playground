<template>
  <div class="card">
    <div class="card-header">
      <div class="info">
        <p class="creator">{{ userName }}</p>
        <div class="moment-date" format="dddd, MMMM Do YYYY">
          {{ createdAt }}
        </div>
      </div>
    </div>
    <div class="card-body">
      <blockquote class="blockquote mb-0">
        <p class="title">"{{ quote }}"</p>
        <footer class="blockquote-footer">
          <cite class="description" title="Source Title">{{ author }}</cite>
        </footer>
        <ul class="tag-list">
          <li v-for="(tag, index) in separateOutTags" :key="index">
            {{ tag }}
          </li>
        </ul>
      </blockquote>
    </div>
    <div v-if="isUserLoggedIn" class="card-footer">
      <ul class="card-actions">
        <li :style="{ width: cardFooterItemWidth }">
          <img
            v-if="!likeFlag"
            src="../../assets/likeIcons/like-unfilled.jpg"
            id="card-icons"
            alt="logo"
            :onclick="() => onClickLike()"
          />
          <img
            v-if="likeFlag"
            src="../../assets/likeIcons/like-filled.png"
            id="card-icons"
            alt="logo"
            :onclick="() => onClickLike()"
          />
          {{ likeCount }}
        </li>
        <li :style="{ width: cardFooterItemWidth }">
          <img
            v-if="!dislikeFlag"
            src="../../assets/likeIcons/like-unfilled.jpg"
            id="card-icons"
            class="dislike-image"
            alt="logo"
            :onclick="() => onClickDislike()"
          />

          <img
            v-if="dislikeFlag"
            src="../../assets/likeIcons/like-filled.png"
            id="card-icons"
            class="dislike-image"
            alt="logo"
            :onclick="() => onClickDislike()"
          />
          {{ dislikeCount }}
        </li>
        <li v-if="showEditDelete" :style="{ width: cardFooterItemWidth }">
          <EditQuote
            :quoteId="quoteId"
            :quote="quote"
            :author="author"
            :tags="tags"
          />
        </li>
        <li v-if="showEditDelete" :style="{ width: cardFooterItemWidth }">
          <img
            src="../../assets/delete.png"
            id="card-icons"
            alt="logo"
            :onclick="() => onClickDelete()"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import { FavQuote } from "@/interfaces/types";
import { helpers } from "@/utils/generalHelpers";
import {
  deleteQuote,
  dislikeDown,
  dislikeUp,
  likeDown,
  likeUp,
} from "@/apis/protectedRoutes";
import { mdiDelete, mdiPencil } from "@mdi/js";
import EditQuote from "@/components/UserDetails/ModalPopup/EditQuote.vue";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  name: "CardItem",
  components: { EditQuote },
  props: [
    "quoteId",
    "quote",
    "author",
    "created_at",
    "tags",
    "likes",
    "dislikes",
    "userName",
    "showEditDelete",
  ],
  data() {
    return {
      likeFlag: false,
      dislikeFlag: false,
      likeCount: this.likes,
      dislikeCount: this.dislikes,
      mdiDelete,
      mdiPencil,
      cardFooterItemWidth: this.showEditDelete ? "25%" : "50%",
    };
  },
  methods: {
    setInitialLiked() {
      const likedQuotes = helpers.getLikedQuotes();
      if (likedQuotes.length)
        likedQuotes.forEach((likedQuote: FavQuote) => {
          if (likedQuote.quote.id === this.quoteId) this.likeFlag = true;
        });
    },
    setInitialDisliked() {
      const dislikedQuotes = helpers.getDislikedQuotes();
      if (dislikedQuotes.length)
        dislikedQuotes.forEach((dislikedQuote: FavQuote) => {
          if (dislikedQuote.quote.id === this.quoteId) this.dislikeFlag = true;
        });
    },
    async onClickLike() {
      if (this.likeFlag) {
        await likeDown(this.quoteId);
        this.likeFlag = false;
        this.likeCount -= 1;
      } else {
        await likeUp(this.quoteId);
        this.likeFlag = true;
        this.likeCount += 1;
      }

      if (this.dislikeFlag) {
        this.dislikeFlag = false;
        this.dislikeCount -= 1;
      }
    },
    async onClickDislike() {
      if (this.dislikeFlag) {
        await dislikeDown(this.quoteId);
        this.dislikeFlag = false;
        this.dislikeCount -= 1;
      } else {
        await dislikeUp(this.quoteId);
        this.dislikeFlag = true;
        this.dislikeCount += 1;
      }

      if (this.likeFlag) {
        this.likeFlag = false;
        this.likeCount -= 1;
      }
    },
    async onClickDelete() {
      let result = await helpers.getConfirmAlert({
        title: "Are you sure you want to delete this quote?",
        icon: "info",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const response = await deleteQuote(this.quoteId);
        if (response.deleted) {
          const userStore = useUserStore();
          userStore.fetchQuotes();
        }
      }
    },
  },
  computed: {
    createdAt() {
      return moment(this.created_at).format("dddd, MMMM Do YYYY");
    },
    separateOutTags() {
      return this.tags.split(",");
    },
    isUserLoggedIn() {
      const isLoggedIn = helpers.getUserLoggedIn();
      if (isLoggedIn) {
        this.setInitialLiked();
        this.setInitialDisliked();
      }
      return isLoggedIn;
    },
  },
});
</script>

<style scoped>
.title {
  white-space: pre-wrap;
  font-style: italic;
  font-size: 20px;
  /* color: #413939; */
}

.description {
  font-style: italic;
  font-size: 17px;
}

.card {
  margin: auto;
  width: 95%;
  margin-bottom: 0.5em;
}

.icons {
  font-size: 15px;
}

.creator {
  color: #5cb85c;
  font-weight: 500 !important;
}

.dislike-image {
  transform: rotate(180deg);
}

/* .like-dislike-value {
	float: right;
	position: relative;
	right: 7.6rem;
} */

.card-heading {
  display: block;
  position: relative;
  font-weight: 300;
  margin-bottom: 0.6rem;
}

.card-heading .info {
  margin: 0 1.5rem 0 0.6rem;
  display: inline-block;
  vertical-align: middle;
  line-height: 0.7rem;
}

.card-heading .info .moment-date {
  color: #bbb;
  font-size: 0.8rem;
}

ul.tag-list {
  float: right;
  max-width: 50%;
  vertical-align: top;
  margin-bottom: 1rem;
  margin-top: 0.6em;
}

ul.tag-list li {
  display: inline-block !important;
  border: 1px solid #ddd;
  color: #aaa !important;
  background: 0 0 !important;
  font-weight: 300;
  font-size: 0.8rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
  margin-right: 3px;
  margin-bottom: 0.2rem;
  white-space: nowrap;
}

/* .ant-card {
	border-bottom-color: rgb(75, 74, 74);
} */

.card-actions {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #f0f0f0;
}

ul.card-actions li {
  float: left;
  margin: 12px 0;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
}

.card-actions > li:not(:last-child) {
  border-right: 1px solid #dfd4d4;
}

.card:hover {
  cursor: pointer;
  border-color: transparent;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
}
</style>
