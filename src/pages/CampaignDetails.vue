<template>
  <v-container fluid class="ma-0 pa-0">
    <v-img
      id="background-clip"
      max-height="50vh"
      min-width="100vw"
      position="center -64px"
      :lazy-src="displayed.thumbnailUrl"
      :src="displayed.imageUrl"
    ></v-img>
    <v-container class="d-flex justify-space-between align-center">
      <avatar-list
        class="ml-1"
        :players="displayed.players.filter((p) => p.isGm)"
      ></avatar-list>
      <div>
        <p class="text-h2">
          {{ displayed.playTimeMs | formatMs }}
        </p>
        <p class="caption">Hours played</p>
      </div>
      <div>
        <p class="text-h2">
          {{ displayed.dicesRolledCount }}
        </p>
        <p class="caption">Dices Rolled</p>
      </div>
      <avatar-list
        class="mr-5"
        :players="displayed.players.filter((p) => !p.isGm)"
      ></avatar-list>
    </v-container>

    <rolls-per-player-by-time
      :hidden="rolls.length === 0"
      :rolls="rolls"
    ></rolls-per-player-by-time>
    <v-skeleton-loader v-if="isLoading" type="card-avatar"></v-skeleton-loader>
    <v-btn @click="fetchAllRolls" v-if="rolls.length === 0">{{
      isLoading ? "Fetching data..." : "Display campaign roll charts"
    }}</v-btn>

    <sessions-list :sessions="displayed.sessions"></sessions-list>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import AvatarList from "@/components/AvatarList.vue";
import SessionsList from "@/components/SessionsList.vue";
import RollsPerPlayerByTime from "@/components/RollsPerPlayerByTime.vue";
import { ChatMessage, Session } from "@/@types/backend.service";
import { IParsedRoll, IRollParsing } from "@/@types/roll-parsing.service";
import { $inject } from "@vanroeybe/vue-inversify-plugin";
import { TYPES } from "@/types";

@Component({
  computed: mapGetters({
    displayed: "getDisplayedCampaign",
  }),
  filters: {
    formatMs(ms: number) {
      const s = ms / 1000;
      const h = s / 3600;
      return `${Math.floor(h)}`;
    },
  },
  components: { RollsPerPlayerByTime, AvatarList, SessionsList },
})
export default class CampaignDetails extends Vue {
  private isLoading: boolean = false;
  private rolls: IParsedRoll[] = [];
  //@ts-ignore
  @$inject(TYPES.RollParsingService) private rollParsingService: IRollParsing;

  async fetchAllRolls() {
    this.isLoading = true;
    // This first fetch is a "hack". By pre-fetching the first session
    // We can be sure that the backend cache will be queried in all others calls
    await this.$store.dispatch("fetchSessionDetails", [
      this.$route.params.id,
      0,
    ]);

    // Fetch all sessions. This is quite an heavy task for larger campaigns
    await Promise.all(
      this.$store.getters.getDisplayedCampaign.sessions.map(
        async (s: Session, i: number) =>
          this.$store.dispatch("fetchSessionDetails", [
            this.$route.params.id,
            i,
          ])
      )
    );

    const allSessions: Session[] = this.$store.getters.getAllSessions(
      this.$route.params.id
    );
    this.rolls = allSessions
      .flatMap((s) => s.messages)
      .filter((m) => this.rollParsingService.isARoll(m))
      // Parse them to have a unified way to process rolls
      .flatMap(
        (m: ChatMessage) => this.rollParsingService.parse(m) as IParsedRoll
      )
      .filter((r: IParsedRoll) => r);
    this.isLoading = false;
  }
  beforeCreate() {
    if (!this.$store.state.campaignList.length) {
      this.$store.dispatch("fetchCampaignList");
    }
  }
  beforeMount() {
    const routeId = this.$route.params.id;
    this.$store.dispatch("fetchCampaignGeneralInfos", routeId);
  }

  beforeRouteUpdate(to: any, from: any, next: any) {
    this.$store.dispatch("fetchCampaignGeneralInfos", to.params.id);
    // Empty rolls and reset loading state to prevent to display wrong data
    this.rolls = [];
    this.isLoading = false;
    next();
  }
}
</script>

<style>
#background-clip {
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
  object-fit: cover;
}
</style>
