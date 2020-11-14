<template>
  <v-container>
    <h2>Roll20 Stats Viewer</h2>
    <v-img src="https://app.roll20.net/v2/images/roll20-logo.png?v=2"></v-img>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {}
</script>

<style>
#products-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  grid-template-rows: repeat(1, minmax(100px, 1fr));
}
#products-list * {
  text-decoration: none; /* no underline */
}
</style>
