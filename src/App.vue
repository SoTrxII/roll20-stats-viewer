<template>
  <v-app>
    <component :is="layout()">
      <router-view />
    </component>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Default from "./layouts/Default.vue";
import Blank from "@/layouts/Blank.vue";
@Component({
  components: {
    Default,
    Blank,
  },
})
export default class App extends Vue {
  private static readonly DEFAULT_LAYOUT = "Default";
  layout() {
    return this.$route.meta.layout || App.DEFAULT_LAYOUT;
  }
}
</script>
