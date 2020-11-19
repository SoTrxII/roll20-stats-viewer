<template>
  <v-container class="ma-0 pa-0">
    <h2 class="ml-3 text-h2">Rolls</h2>
    <rolls-per-player-by-time :rolls="rolls"></rolls-per-player-by-time>
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
import { IParsedRoll, IRollParsing } from "@/@types/roll-parsing.service";
import { $inject } from "@vanroeybe/vue-inversify-plugin";
import { TYPES } from "@/types";
import { ChatMessage } from "@/@types/backend.service";

@Component({
  computed: mapGetters({
    displayed: "getDisplayedSession",
  }),
  components: { VuePlotly, SessionTimeline, RollsPerPlayerByTime },
})
export default class SessionDetails extends Vue {
  //@ts-ignore
  @$inject(TYPES.RollParsingService) private rollParsingService: IRollParsing;
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
  get rolls(): IParsedRoll[] {
    return (
      this.$store.getters.getDisplayedSession.messages
        // Get only dice rolls
        .filter((m: ChatMessage) => this.rollParsingService.isARoll(m))

        // Parse them to have a unified way to process rolls
        .flatMap((m: ChatMessage) => this.rollParsingService.parse(m))
        .filter((r: IParsedRoll) => r)
    );
  }
}
</script>

<style>
.limited {
  height: 40vh;
}
</style>
