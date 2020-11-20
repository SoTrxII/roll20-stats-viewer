<template>
  <image-composition :images="images"></image-composition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ImageComposition from "@/components/ImageComposition.vue";
import { CampaignBasicInfos } from "@/@types/backend.service";

@Component({
  components: { ImageComposition },
})
export default class Home extends Vue {
  get images() {
    return this.$store.state.campaignList.map(
      (c: CampaignBasicInfos) => c.imageUrl
    );
  }
}
</script>
