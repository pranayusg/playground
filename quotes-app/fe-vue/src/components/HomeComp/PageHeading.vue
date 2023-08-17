<template>
  <div class="container">
    <div class="row m-2">
      <div class="col-8">
        <h5 class="logo">QuotesApp</h5>
      </div>
      <div v-if="isUserLoggedIn" class="col-4" style="display: flex">
        <NewQuote />
        <button-custom @click="onUsernameClick">
          <img src="../../assets/profile.png" id="image-icons" alt="user-img" />
          {{ userName }}
        </button-custom>
      </div>
      <div v-else class="col" style="display: flex">
        <SignUp />
        <SignIn />
      </div>
    </div>
  </div>
  <div v-if="!isUserLoggedIn" class="container-fluid">
    <div class="jumbotron">
      <div class="content">
        <h2 class="jumbotron-heading">QuotesApp</h2>
        <p class="jumbotron-content">A place to share your favourite quotes.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SignUp from "@/components/ModalPopup/SignUp.vue";
import SignIn from "@/components/ModalPopup/SignIn.vue";
import NewQuote from "@/components/ModalPopup/NewQuote.vue";
import { helpers } from "@/utils/generalHelpers";
import { auth } from "@/utils/authHelpers";
import router from "@/router";

export default defineComponent({
  name: "PageHeading",
  components: {
    SignUp,
    SignIn,
    NewQuote,
  },
  methods: {
    onUsernameClick() {
      router.push("/userdetails");
    },
  },
  computed: {
    // a computed getter
    isUserLoggedIn() {
      return helpers.getUserLoggedIn();
    },
    userName() {
      return auth.getUsername();
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.jumbotron {
  background-color: #5cb85c;
}

.content {
  padding: 1%;
  color: white;
  text-align: center;
}

.jumbotron-heading {
  color: white;
  font-weight: 700 !important;
  font-size: 2.2rem;
  text-shadow: 0 1px 3px rgb(0 0 0 / 30%);
}

.jumbotron-content {
  font-size: 1.3em;
  font-family: "Times New Roman", Times, serif;
}
</style>
