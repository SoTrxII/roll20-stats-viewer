<template>
  <v-app>
    <v-main>
      <v-progress-linear
        style="z-index: 9999"
        indeterminate="true"
        :active="isLoading"
        height="6"
        top
        color="deep-purple accent-4"
      ></v-progress-linear>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: mapGetters({
    isLoading: "isLoading",
  }),
})
export default class Blank extends Vue {}
</script>

<style></style>
