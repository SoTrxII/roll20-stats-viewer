import Vue from "vue";
import Router from "vue-router";
import Home from "@/pages/Home.vue";
import { container } from "@/inversify.config";
import { TYPES } from "@/types";
import { IAuthService } from "@/@types/auth.service";
import CampaignDetails from "@/pages/CampaignDetails.vue";
import SessionDetails from "@/pages/SessionDetails.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      //@ts-ignore
      component: Home,
    },
    {
      path: "/campaign/:id",
      name: "campaign details",
      //@ts-ignore
      component: CampaignDetails,
    },
    {
      path: "/session/:cid/:sid",
      name: "sessions details",
      //@ts-ignore
      component: SessionDetails,
    },
  ],
});

export default router;
