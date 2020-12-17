import Vue from "vue";
import Router from "vue-router";
import Home from "@/pages/Home.vue";
import { container } from "@/inversify.config";
import { TYPES } from "@/types";
import { IAuthService } from "@/@types/auth.service";
import CampaignDetails from "@/pages/CampaignDetails.vue";
import SessionDetails from "@/pages/SessionDetails.vue";
import Login from "@/pages/Login.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      //@ts-ignore
      component: Home,
      meta: {
        requiresAuth: process.env.VUE_APP_AUTH == "DYNAMIC",
      },
    },
    {
      path: "/login",
      name: "login",
      //@ts-ignore
      component: Login,
      meta: {
        layout: "Blank",
      },
    },

    {
      path: "/campaign/:id",
      name: "campaign details",
      //@ts-ignore
      component: CampaignDetails,
      meta: {
        requiresAuth: process.env.VUE_APP_AUTH == "DYNAMIC",
      },
    },
    {
      path: "/session/:cid/:sid",
      name: "sessions details",
      //@ts-ignore
      component: SessionDetails,
      meta: {
        requiresAuth: process.env.VUE_APP_AUTH == "DYNAMIC",
      },
    },
  ],
});

//Allow a service-locator pattern for the router only
const authService = container.get<IAuthService>(TYPES.AuthService);
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const loggedIn = authService.isLoggedIn();
    if (!loggedIn) next({ name: "login" });
    else next();
  } else {
    next();
  }
});

export default router;
