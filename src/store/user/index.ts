import { get } from "@/utils/storage";
import { getInfo } from "@/services/user";
import { UserState, UserInfo } from "@/types";

const RootState = get("RootState");
const userLoginInfo = get("userLoginInfo", localStorage);

// 如果缓存中存在用户模块数据，则将缓存中的数据设置给state
const state: UserState = (RootState && RootState.user) ||
  (userLoginInfo && { userLoginInfo, userInfo: null }) || {
    userLoginInfo: null, // 用户登陆信息
    userInfo: null // 用户信息
  };

const getters = {
  /**
   * 获取用户登陆信息
   * @param state
   */
  userLoginInfo(state: UserState) {
    return state.userLoginInfo;
  },
  /**
   * 获取用户信息
   * @param state
   */
  userInfo(state: UserState): UserInfo {
    return state.userInfo;
  }
};

const mutations = {
  /**
   * 设置用户登陆信息
   * @param state
   * @param data
   */
  setUserLoginInfo(state: UserState, data: object) {
    state.userLoginInfo = data;
  },
  /**
   * 设置用户信息
   * @param state
   * @param data
   */
  setUserInfo(state: UserState, data: UserInfo) {
    state.userInfo = data;
  }
};

const actions = {
  /**
   * 调用接口获取用户信息
   * @param commit
   */
  async getInfo({ commit }: { commit: Function }) {
    try {
      const data = await getInfo();
      commit("setUserInfo", data);
    } catch (e) {
      console.log(e);
    }
  }
};

export default { namespaced: true, state, getters, mutations, actions };
