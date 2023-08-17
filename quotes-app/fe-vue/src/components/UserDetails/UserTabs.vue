<template>
  <div class="container">
    <div class="row">
      <v-card>
        <v-tabs v-model="tab" bg-color="primary" align-tabs="center">
          <v-tab value="1">My Quotes</v-tab>
          <v-tab value="2">Favourite Quotes</v-tab>
          <v-tab value="3">Disliked Quotes</v-tab>
        </v-tabs>

        <div class="user-center">
          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="1">
                <ShowQuotes :myQuotes="true" />
              </v-window-item>

              <v-window-item value="2">
                <ShowQuotes :favorite="true" />
              </v-window-item>

              <v-window-item value="3">
                <ShowQuotes :disliked="true" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ShowQuotes from "../DisplayQuotes/ShowQuotes.vue";

export default defineComponent({
  name: "UserTabs",
  components: { ShowQuotes },
  data: () => ({
    tab: "1",
  }),
});
</script>
