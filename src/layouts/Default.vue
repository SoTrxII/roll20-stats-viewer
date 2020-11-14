<template>
  <v-app>
    <v-app-bar flat app class="toppedBg" :src="displayed.imageUrl">
      <template v-slot:img="{ props }">
        <v-img
          :lazy-src="displayed.thumbnailUrl"
          v-bind="props"
          position="center top"
          max-height="50vh"
          min-width="100vw"
        ></v-img>
      </template>
      <v-app-bar-nav-icon
        @click="isDrawerVisible = !isDrawerVisible"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>{{ displayed.name }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="isDrawerVisible" app width="192">
      <v-container fill-height>
        <v-list>
          <v-list-item
            class="mt-lg-7"
            v-for="c of $store.state.campaignList"
            v-bind:key="c.id"
          >
            <v-hover v-slot="{ hover }">
              <router-link :to="'/campaign/' + c.id">
                <v-avatar class="mx-auto elevation-1" :size="128">
                  <v-img
                    :class="hover ? 'blurred' : ''"
                    :src="c.imageUrl"
                  ></v-img>
                  <v-overlay absolute :value="hover">{{ c.name }} </v-overlay>
                </v-avatar>
              </router-link>
            </v-hover>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-main>
      <v-progress-linear
        :active="isLoading"
        :indeterminate="isDrawerVisible"
        absolute
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
    displayed: "getDisplayedCampaign",
    isLoading: "isLoading",
  }),
})
export default class Default extends Vue {
  private isDrawerVisible = false;

  beforeCreate() {
    this.$store.dispatch("fetchCampaignList");
  }
}
</script>

<style>
.toppedBg {
  background-position: top center;
}
</style>
