<template>
  <v-container class="d-flex fill-height full-width">
    <div
      class="onTop headline white--text text--lighten-1 align-center ma-auto d-flex flex-column"
    >
      <h2>I didn't know what to do</h2>
      <h2>So here's some waves</h2>
      <img class="justify-center" src="https://i.imgur.com/BIMU2Dd.png" />
      <h2>Why ? No idea.</h2>
    </div>
    <div class="waveWrapper waveAnimation">
      <div class="waveWrapperInner bgTop">
        <div
          class="wave waveTop"
          style="
            background-image: url('http://front-end-noobs.com/jecko/img/wave-top.png');
          "
        ></div>
      </div>
      <div class="waveWrapperInner bgMiddle">
        <div
          class="wave waveMiddle"
          style="
            background-image: url('http://front-end-noobs.com/jecko/img/wave-mid.png');
          "
        ></div>
      </div>

      <div class="waveWrapperInner bgBottom">
        <div
          class="wave waveBottom"
          style="
            background-image: url('http://front-end-noobs.com/jecko/img/wave-bot.png');
          "
        ></div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ImageComposition extends Vue {
  @Prop({ required: true }) private images!: string[];
}
</script>

<style lang="css">
.full-width {
  width: 100%;
}
.onTop {
  z-index: 1000;
}

@keyframes move_wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}
.waveWrapper {
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}
.waveWrapperInner {
  position: absolute;
  width: 100%;
  overflow: hidden;
  height: 100%;
  bottom: -1px;
  background-image: linear-gradient(to top, #f0f0f0 20%, #78789e 80%);
}
.bgTop {
  z-index: 15;
  opacity: 0.5;
}
.bgMiddle {
  z-index: 10;
  opacity: 0.75;
}
.bgBottom {
  z-index: 5;
}
.wave {
  position: absolute;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat no-repeat;
  background-position: 0 bottom;
  transform-origin: center bottom;
}
.waveTop {
  background-size: 50% 100px;
}
.waveAnimation .waveTop {
  animation: move-wave 3s;
  -webkit-animation: move-wave 3s;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
.waveMiddle {
  background-size: 50% 120px;
}
.waveAnimation .waveMiddle {
  animation: move_wave 10s linear infinite;
}
.waveBottom {
  background-size: 50% 100px;
}
.waveAnimation .waveBottom {
  animation: move_wave 15s linear infinite;
}
</style>
