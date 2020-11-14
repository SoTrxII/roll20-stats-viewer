<template>
  <v-container class="displayed-as-grid">
    <v-card
      v-for="(s, index) of orderedSessions"
      v-bind:key="s.start"
      class="pr-1 ma-2"
    >
      <router-link :to="'/session/' + $route.params.id + '/' + index">
        <v-card-title>Session {{ index + 1 }}</v-card-title>
        <v-card-subtitle
          >{{ s.start | formatDate }} -
          {{ s.end | formatDate }}</v-card-subtitle
        >
      </router-link>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Session } from "@/@types/backend.service";

@Component({
  filters: {
    formatDate(ts: number) {
      const date = new Date(ts);
      let minutes = String(date.getMinutes());
      if (Number(minutes) < 10) minutes = "0" + minutes;
      let hours = String(date.getHours());
      if (Number(hours) < 10) hours = "0" + hours;

      return `${date.toDateString()} ${hours}:${minutes}`;
    },
  },
})
export default class SessionsList extends Vue {
  @Prop({ required: true }) private sessions!: Session[];

  get orderedSessions() {
    return this.sessions.sort((s1, s2) => s1.start - s2.start);
  }
}
</script>

<style>
.displayed-as-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}
</style>
