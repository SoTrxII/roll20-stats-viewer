<template>
  <v-container>
    <v-btn
      elevation="2"
      v-for="d of dicesTypes"
      v-bind:key="d"
      @click="changePlotData(d)"
    >
      <v-icon>mdi-dice-d20-outline</v-icon>{{ d }}</v-btn
    >
    <vue-plotly :data="displayedData" :layout="layout" :options="options">
    </vue-plotly>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VuePlotly from "@statnett/vue-plotly";
import {
  DiceResult,
  PlainRollChatMessage,
  Session,
} from "@/@types/backend.service";
import { $inject } from "@vanroeybe/vue-inversify-plugin";
import { TYPES } from "@/types";
import { IParsedRoll, IRollParsing } from "@/@types/roll-parsing.service";

@Component({
  components: { VuePlotly },
})
export default class RollsPerPlayerByTime extends Vue {
  @Prop({ required: true }) private session!: Session;
  private displayedData: any = [];
  //@ts-ignore
  @$inject(TYPES.RollParsingService)
  private readonly rollParsingService!: IRollParsing;

  changePlotData(diceType: number) {
    this.displayedData = this.formatData(diceType);
  }
  mounted() {
    console.log("updated");
  }

  formatData(diceType: number) {
    const playerRolls = this.session.messages
      // Get only dice rolls
      .filter(
        (m) =>
          m.type === "rollresult" ||
          m.type === "gmrollresult" ||
          (m.type === "general" &&
            Object.prototype.hasOwnProperty.call(m, "rolltemplate"))
      )
      // Parse them to have a unified way to process rolls
      .flatMap((m) => this.rollParsingService.parse(m))
      // Having at least one roll with the required type
      .filter(
        (m) =>
          m?.originalRolls.filter((r: DiceResult) => r.sides === diceType)
            .length
      )
      // Sort them by date
      .sort((m1, m2) => m1!.timestamp - m2!.timestamp)
      // And group them by player
      .reduce((acc: Record<string, any>, m) => {
        (acc[m!.playerId] ??= []).push(m);
        return acc;
      }, {});

    // For each player, return rolls results by time
    const data = [];
    for (const playerId in playerRolls) {
      data.push(
        playerRolls[playerId].reduce(
          (trace: Record<string, any>, m: IParsedRoll) => {
            trace.name ??= m.who;
            // For each rolls group
            m.originalRolls
              // Only keep the groups with the required dice types
              .filter((r: DiceResult) => r.sides === diceType)
              // Split each roll in the remaining group
              .flatMap((r: DiceResult) =>
                r.results.flatMap((v) => Object.values(v))
              )
              .forEach((r: number) => {
                (trace.x ??= []).push(new Date(m.timestamp));
                (trace.y ??= []).push(r);
              });

            return trace;
          },
          {}
        )
      );
    }
    return data;
  }

  /**
   * Get all types of dices used in this subset of data
   */
  get dicesTypes(): number[] {
    const dicesTypes = new Set<number>();
    this.session.messages
      .filter((m) => m.type === "rollresult" || m.type === "gmrollresult")
      //@ts-ignore
      .forEach((m: PlainRollChatMessage) => {
        m.content.rolls
          .map((r: DiceResult) => r.sides)
          .forEach((s: number) => dicesTypes.add(s));
      });
    return Array.from(dicesTypes);
  }
  get layout() {
    return {};
  }
  get options() {
    return {};
  }
}
</script>

<style></style>
