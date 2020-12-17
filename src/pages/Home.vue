<template>
  <image-composition>
    <template v-slot:centered>
      <h2>I didn't know what to do</h2>
      <h2>So here's some waves</h2>
      <img class="justify-center" src="https://i.imgur.com/BIMU2Dd.png" />
      <h2>Why ? No idea.</h2>
    </template>
  </image-composition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImageComposition from "@/components/ImageComposition.vue";

@Component({
  components: { ImageComposition },
})
export default class Home extends Vue {}
</script>
