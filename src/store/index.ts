import Vue from "vue";
import Vuex, { Store } from "vuex";
import user from "./user";
import { set } from "@/utils/storage";
import { RootState } from "@/types";

Vue.use(Vuex);

const myPlugin = (store: Store<RootState>) => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // 将state数据缓存到浏览器会话缓存中
    set("RootState", state);
    // 将用户登陆信息放置到本地缓存，当用户再次打开浏览器时，可以直接使用上次到登陆信息
    if (mutation.type === "user/setUserLoginInfo") {
      set("userLoginInfo", state.user.userLoginInfo, localStorage);
    }
  });
};

export default new Vuex.Store({
  // @ts-ignore：state中的数据由modules提供
  state: {},
  mutations: {},
  actions: {},
  modules: { user },
  plugins: [myPlugin]
});
