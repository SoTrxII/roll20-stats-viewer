import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);
import { container } from "@/inversify.config";
import { TYPES } from "@/types";
import { IAuthService, UserInfos } from "@/@types/auth.service";
import {
  CampaignBasicInfos,
  CampaignGeneralInfos,
  IBackend,
  Player,
  Session,
} from "@/@types/backend.service";
import SessionDetails from "@/pages/SessionDetails.vue";
const backend = container.get<IBackend>(TYPES.BackendService);
export default new Vuex.Store({
  state: {
    //products: undefined,
    loading: false,
    campaignList: [],
    campaignsGeneralInfo: new Map<string, CampaignGeneralInfos>(),
    sessionsDetails: new Map<string, SessionDetails>(),
    displayedCampaign: {
      id: "",
      playTimeMs: 0,
      name: "",
      imageUrl: "",
      thumbnailUrl: "",
      players: [],
      dicesRolledCount: 0,
      sessions: [],
    },
    displayedSession: {
      start: 0,
      end: 0,
      messages: [
        {
          ".priority": "",
          avatar: "",
          content: {},
          playerid: "",
          type: "",
          who: "",
        },
      ],
    },
  },
  getters: {
    isLoading(state) {
      return state.loading;
    },
    getGeneralInfos: (state) => (id: string) => {
      return state.campaignsGeneralInfo.get(id);
    },
    getBasicInfos: (state) => (id: string) => {
      return state.campaignList.find((c: CampaignBasicInfos) => c.id === id);
    },
    getDisplayedCampaign: (state): CampaignGeneralInfos => {
      return state.displayedCampaign;
    },
    getDisplayedSession: (state): Session => {
      //@ts-ignore
      return state.displayedSession;
    },
    getAllSessions: (state) => (id: string): SessionDetails[] => {
      const data: SessionDetails[] = [];
      const fullSessionId = (sId: number) => `${id}${sId}`;
      for (let i = 0; state.sessionsDetails.has(fullSessionId(i)); i++) {
        data.push(
          state.sessionsDetails.get(fullSessionId(i)) as SessionDetails
        );
      }
      return data;
    },
  },
  mutations: {
    /*setProducts(state, products) {
      state.products = products;
    },*/
    setCampaignList(state: Record<string, any>, cList: CampaignBasicInfos[]) {
      state.campaignList = cList;
    },
    addGeneralInfos(state: Record<string, any>, infos: CampaignGeneralInfos) {
      state.campaignsGeneralInfo.set(infos.id, infos);
    },
    setDisplayedCampaign(state: Record<string, any>, c: CampaignGeneralInfos) {
      Object.assign(state.displayedCampaign, c);
    },
    addSessionInfos(state: Record<string, any>, infos: [number, Session]) {
      state.sessionsDetails.set(infos[0], infos[1]);
    },
    setDisplayedSession(state: Record<string, any>, s: Session) {
      Object.assign(state.displayedSession, s);
    },
  },
  actions: {
    /*fetchProducts({ commit }) {
      return backend.getProducts().then(async (products: Product[]) => {
        commit("setProducts", products);
      });
    },*/
    async fetchCampaignList({ commit, state }: any) {
      state.loading = true;
      let cList = undefined;
      if (!state.campaignList.length) {
        cList = await backend.getCampaignList();
        commit("setCampaignList", cList);
      }
      state.loading = false;
    },
    async fetchCampaignGeneralInfos({ commit, state }: any, id: string) {
      state.loading = true;
      let cInfos = undefined;
      if (!state.campaignsGeneralInfo.has(id)) {
        cInfos = await backend.getDetailsOfCampaign(id);
        commit("addGeneralInfos", cInfos);
      }
      cInfos = state.campaignsGeneralInfo.get(id);
      commit("setDisplayedCampaign", cInfos);
      state.loading = false;
    },
    async fetchSessionDetails({ commit, state }: any, ids: [string, string]) {
      state.loading = true;
      let sInfos = undefined;
      const fullSessionId = `${ids[0]}${ids[1]}`;
      if (!state.sessionsDetails.has(fullSessionId)) {
        sInfos = await backend.getDetailsOfSession(ids[0], ids[1]);
        commit("addSessionInfos", [fullSessionId, sInfos]);
      }
      sInfos = state.sessionsDetails.get(fullSessionId);
      commit("setDisplayedSession", sInfos);
      state.loading = false;
    },
  },
});
