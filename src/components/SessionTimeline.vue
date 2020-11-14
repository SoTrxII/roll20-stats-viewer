<template>
  <v-timeline class="fill-height">
    <v-virtual-scroll :items="session.messages" :item-height="100">
      <template v-slot:default="{ item }">
        <v-timeline-item large :key="item['.priority']">
          <template v-slot:icon>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar>
                  <img
                    :src="getAbsoluteLinkOf(item.avatar)"
                    v-bind="attrs"
                    v-on="on"
                  />
                </v-avatar>
              </template>
              <span>{{ item.who }}</span>
            </v-tooltip>
          </template>
          <template
            v-if="
              item.rolltemplate !== undefined ||
              item.type == 'rollresult' ||
              item.type == 'gmrollresult'
            "
            v-slot:opposite
          >
            <span
              v-html="formatDiceResult(rollParsingService.parse(item))"
            ></span>
            <v-spacer></v-spacer>
            <span class="caption">{{ item[".priority"] | formatDate }}</span>
          </template>
          <v-card
            v-if="item.type === 'general' && item.rolltemplate == undefined"
            class="elevation-2"
          >
            <v-card-text class="pb-1">{{ item.content }}</v-card-text>
            <v-card-text class="caption ma-0 pt-0">{{
              item[".priority"] | formatDate
            }}</v-card-text>
          </v-card>
        </v-timeline-item>
      </template>
    </v-virtual-scroll>
  </v-timeline>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Session } from "@/@types/backend.service";
import { $inject } from "@vanroeybe/vue-inversify-plugin";
import { IParsedRoll, IRollParsing } from "@/@types/roll-parsing.service";
import { TYPES } from "@/types";

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
export default class SessionTimeline extends Vue {
  //@ts-ignore
  @$inject(TYPES.RollParsingService)
  private readonly rollParsingService!: IRollParsing;

  @Prop({ required: true }) private session!: Session;

  getAbsoluteLinkOf(url: string) {
    if (url.startsWith("/")) {
      return "https://app.roll20.net" + url;
    }
    return url;
  }

  formatDiceResult(ds: IParsedRoll) {
    let formattedRoll = "";
    if (ds.skill) {
      let skillname = ds.skill.toLowerCase();
      formattedRoll += `<span class="font-weight-bold"">${
        skillname.charAt(0).toUpperCase() + skillname.slice(1)
      }</span> : `;
    }
    formattedRoll += `${ds.rollString} = ${ds.rollResult}`;

    let addedText = "";
    if (ds.rollType == "critsuccess") {
      addedText += `<span class="green--text">Critical Success !</span>`;
    } else if (ds.rollType == "critfailure") {
      addedText += `<span class="red--text">Fumble !</span>`;
    }
    return `Rolling ${formattedRoll} <br/> ${addedText}`;
  }
}
</script>

<style>
a {
  text-decoration: none;
}
</style>
