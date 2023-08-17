<template>
  <!-- <nav>
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</nav> -->
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/utils/authHelpers";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
  beforeMount() {
    if (auth.isLoggedIn()) {
      const userStore = useUserStore();
      userStore.loginUserFromToken();
    }
  },
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.swal2-container {
  z-index: 5000;
}

.user-center {
  margin: auto;
  width: 80%;
}

a:hover {
  color: black !important;
  background-color: white !important;
}

#card-icons {
  width: 17px;
  height: 2%;
  margin-right: 30px;
}

#image-icons {
  width: 17px;
  height: 2%;
  margin-right: 5px;
}

.logo {
  color: #5cb85c;
  text-align: left;
}
</style>
