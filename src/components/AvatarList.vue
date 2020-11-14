<template>
  <div>
    <v-hover
      v-slot="{ hover }"
      v-for="p of playersToRender"
      v-bind:key="p.roll20Id"
    >
      <v-avatar :class="classes()" :size="sizeOfImage">
        <v-img :class="hover ? 'blurred' : ''" :src="imageOrDefault(p)"></v-img>
        <v-overlay absolute :value="hover"
          >{{ p.username + (p.isGm ? " (GM)" : "") }}
        </v-overlay>
      </v-avatar>
    </v-hover>
    <v-tooltip top
      ><template v-slot:activator="{ on, attrs }">
        <v-avatar
          v-if="players.length > maxPlayersToRender || isExtended"
          class="elevation-1 ma-n5"
          color="lightgrey"
          v-bind="attrs"
          v-on="on"
          :size="sizeOfImage"
        >
          <v-icon v-if="isExtended" x-large @click="onClickEllipsis"
            >mdi-dots-vertical</v-icon
          >
          <v-icon v-else x-large @click="onClickEllipsis"
            >mdi-dots-horizontal</v-icon
          >
        </v-avatar>
      </template>
      {{ playersToHide.map((p) => p.username).join(" & ") }}
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/@types/backend.service";

@Component
export default class AvatarList extends Vue {
  @Prop({ required: true }) private players!: Player[];
  @Prop({ required: false }) private avatarSize!: number;
  private static readonly DEFAULT_IMAGE =
    "https://images-na.ssl-images-amazon.com/images/I/812Ut4KvzAL._AC_UY395_.jpg";
  private extendedPlayerNumber = 0;

  imageOrDefault(p: Player): string {
    return p.avatarUrl ?? AvatarList.DEFAULT_IMAGE;
  }

  get playersToRender(): Player[] {
    return this.players.slice(0, this.maxPlayersToRender);
  }

  get playersToHide(): Player[] {
    return this.players.slice(this.maxPlayersToRender);
  }

  onClickEllipsis() {
    // Extends the view
    if (!this.isExtended) this.extendedPlayerNumber = this.players.length;
    else this.extendedPlayerNumber = 0;
  }

  get maxPlayersToRender(): number {
    if (this.extendedPlayerNumber !== 0) return this.extendedPlayerNumber;
    let val = 0;
    if (this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs) {
      val = 1;
    } else val = 3;
    return Math.min(val, this.players.length);
  }

  get sizeOfImage(): number {
    if (this.$vuetify.breakpoint.xs) {
      return 100;
    } else return 128;
  }

  get isExtended() {
    return this.extendedPlayerNumber === this.maxPlayersToRender;
  }

  classes(): string {
    const classes = ["elevation-1"];
    if (this.isExtended) classes.push("ma-n9");
    else if (this.players.length > 1) classes.push("ma-n5");
    return classes.join(" ");
  }
}
</script>

<style>
.blurred {
  filter: blur(3px) grayscale(80%) brightness(60%);
}
</style>
