<template>
  <v-container class="ma-0 pa-0">
    <h2 class="ml-3 text-h2">Rolls</h2>
    <rolls-per-player-by-time :session="displayed"></rolls-per-player-by-time>
    <h2 class="ml-3 text-h2">Timeline</h2>
    <div class="limited">
      <session-timeline :session="displayed"></session-timeline>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import VuePlotly from "@statnett/vue-plotly";
import SessionTimeline from "@/components/SessionTimeline.vue";
import RollsPerPlayerByTime from "@/components/RollsPerPlayerByTime.vue";

@Component({
  computed: mapGetters({
    displayed: "getDisplayedSession",
  }),
  components: { VuePlotly, SessionTimeline, RollsPerPlayerByTime },
})
export default class SessionDetails extends Vue {
  beforeMount() {
    this.$store.dispatch("fetchSessionDetails", [
      this.$route.params.cid,
      this.$route.params.sid,
    ]);
  }

  beforeRouteUpdate(to: any, from: any, next: any) {
    this.$store.dispatch("fetchSessionDetails", [to.params.cid, to.params.sid]);
    next();
  }
}
</script>

<style>
.limited {
  height: 40vh;
}
</style>
