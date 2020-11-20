<template>
  <v-container>
    <v-container class="d-flex flex-row justify-space-between">
      <div>
        <v-btn
          elevation="2"
          v-for="d of dicesTypes"
          v-bind:key="d"
          @click="changePlotData(d)"
        >
          <v-icon>mdi-dice-d20-outline</v-icon>{{ d }}</v-btn
        >
      </div>

      <v-radio-group v-model="selectedChartType" row mandatory>
        <v-radio
          v-for="type of CHART_TYPE"
          :key="type"
          :label="type"
          :value="type"
          @click="changePlotData()"
        ></v-radio>
      </v-radio-group>
    </v-container>

    <vue-plotly
      :hidden="!isDisplayed(CHART_TYPE.SCATTER)"
      :data="displayedScatterData"
      :layout="layout"
      :options="options"
    ></vue-plotly>

    <vue-plotly
      :hidden="!isDisplayed(CHART_TYPE.BOX)"
      :data="displayedBoxData"
      :layout="layout"
      :options="options"
    ></vue-plotly>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VuePlotly from "@statnett/vue-plotly";
import { DiceResult } from "@/@types/backend.service";
import { IParsedRoll } from "@/@types/roll-parsing.service";

//This is a weird bug with enum outside classes
// We are forced to ignore it
// eslint-disable-next-line no-unused-vars
enum CHART_TYPE {
  // eslint-disable-next-line no-unused-vars
  BOX = "box",
  // eslint-disable-next-line no-unused-vars
  SCATTER = "scatter",
}
@Component({
  components: { VuePlotly },
})
export default class RollsPerPlayerByTime extends Vue {
  @Prop({ required: true }) private rolls!: IParsedRoll[];
  private displayedScatterData: any = [];
  private displayedBoxData: any = [];
  private selectedChartType: string = CHART_TYPE.BOX;
  private CHART_TYPE = CHART_TYPE;
  // Last used dice type cache, allow for redraws without arguments
  private lastDiceType: number = 0;

  isDisplayed(chartType: string): boolean {
    return chartType === this.selectedChartType;
  }
  changePlotData(diceType?: number) {
    this.displayedScatterData = this.formatData(diceType, CHART_TYPE.SCATTER);
    this.displayedBoxData = this.formatData(diceType, CHART_TYPE.BOX);
  }
  formatData(diceType: number = this.lastDiceType, chartType: string) {
    this.lastDiceType = diceType;
    const playerRolls = this.rolls
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
      let trace;
      const pRolls = playerRolls[playerId];
      switch (chartType) {
        case CHART_TYPE.SCATTER:
          trace = this.formatTracesForScatter(pRolls, diceType);
          break;
        case CHART_TYPE.BOX:
          trace = this.formatTracesForBox(pRolls, diceType);
          break;
      }
      data.push(trace);
    }
    return data;
  }

  mounted(): void {
    window.addEventListener("resize", () => this.changePlotData());
  }

  beforeDestroy(): void {
    window.removeEventListener("resize", () => this.changePlotData());
  }

  formatTracesForScatter(playerRolls: IParsedRoll[], diceType: number) {
    return playerRolls.reduce((trace: Record<string, any>, m: IParsedRoll) => {
      trace.name ??= m.who;
      trace.mode = "lines";
      // For each rolls group
      m.originalRolls
        // Only keep the groups with the required dice types
        .filter((r: DiceResult) => r.sides === diceType)
        // Split each roll in the remaining group
        .flatMap((r: DiceResult) => r.results.flatMap((v) => Object.values(v)))
        .forEach((r: number) => {
          (trace.x ??= []).push(new Date(m.timestamp).toISOString());
          (trace.y ??= []).push(r);
        });
      return trace;
    }, {});
  }
  formatTracesForBox(playerRolls: IParsedRoll[], diceType: number) {
    return playerRolls.reduce((trace: Record<string, any>, m: IParsedRoll) => {
      trace.name ??= m.who;
      trace.type ??= "box";
      // For each rolls group
      m.originalRolls
        // Only keep the groups with the required dice types
        .filter((r: DiceResult) => r.sides === diceType)
        // Split each roll in the remaining group
        .flatMap((r: DiceResult) => r.results.flatMap((v) => Object.values(v)))
        .forEach((r: number) => {
          (trace.y ??= []).push(r);
        });
      return trace;
    }, {});
  }
  /**
   * Get all types of dices used in this subset of data
   */
  get dicesTypes(): number[] {
    const dicesTypes = new Set<number>();
    this.rolls.forEach((r: IParsedRoll) => {
      r.originalRolls
        .map((r: DiceResult) => r.sides)
        .forEach((s: number) => dicesTypes.add(s));
    });
    return Array.from(dicesTypes)
      .filter((d) => d)
      .sort((d1, d2) => d1 - d2);
  }
  get layout() {
    return {
      autosize: true,
      showlegend: !this.$vuetify.breakpoint.smAndDown,
    };
  }
  get options() {
    return {};
  }
}
</script>

<style></style>
