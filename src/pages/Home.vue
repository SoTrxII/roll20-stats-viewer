<template>
  <v-container>
    <p class="display-1">
      Hey this is the Home page, probably the last thing I'll build because it's
      boring af. This is a dev build, don't expect fancy things.
    </p>
    <h2 class="display-2">
      Use the burger menu to choose a campaign to display.
    </h2>

    <p></p>
    <h3>Here's a walking chicken in the meantime</h3>
    <v-img
      src="https://media1.tenor.com/images/8901446370d2dc324959d168aa7eadcf/tenor.gif"
    ></v-img>
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
