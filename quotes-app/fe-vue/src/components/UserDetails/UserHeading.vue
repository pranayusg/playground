<template>
  <div class="container">
    <div class="row m-2">
      <div class="col-8">
        <h5 class="logo">QuotesApp</h5>
      </div>
      <div class="col-4">
        <button-custom @click="onHomeClick">
          <img
            src="../../assets/home.png"
            id="image-icons"
            alt="settings-img"
          />

          Home
        </button-custom>
        <UserSettings @onUserNameUpdate="updateUserName" />
        <button-custom color="primary" @click="logout"> Log out </button-custom>
      </div>
    </div>
  </div>
  <div class="container-fluid m-2">
    <div class="user-jumbotron">
      <div class="user-content">
        <img
          src="https://api.realworld.io/images/smiley-cyrus.jpeg"
          class="user-img"
          alt="user-img"
        />

        <h5 class="user-jumbotron-content">{{ userName }}</h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserSettings from "../UserDetails/ModalPopup/UserSettings.vue";
import { auth } from "../../utils/authHelpers";
import { helpers } from "../../utils/generalHelpers";
import router from "@/router";

export default defineComponent({
  name: "UserHeading",
  components: { UserSettings },
  data() {
    return {
      userName: auth.getUsername(),
    };
  },
  methods: {
    logout() {
      helpers.logout();
      router.push("/");
    },
    onHomeClick() {
      router.push("/");
    },
    updateUserName() {
      this.userName = auth.getUsername();
    },
  },
});
</script>

<style scoped>
.user-jumbotron {
  text-align: center;
  background: #f3f3f3;
  padding: 1rem 0 1rem;
}

.user-content {
  padding: 1%;
  text-align: center;
}

.user-jumbotron-content {
  font-size: 1.4em;
  font-family: "Times New Roman", Times, serif;
}

.user-jumbotron .user-content .user-img {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  margin-bottom: 1rem;
}
</style>
