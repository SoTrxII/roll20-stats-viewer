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
    <sessions-list :sessions="displayed.sessions"></sessions-list>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import AvatarList from "@/components/AvatarList.vue";
import SessionsList from "@/components/SessionsList.vue";

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
  components: { AvatarList, SessionsList },
})
export default class CampaignDetails extends Vue {
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
