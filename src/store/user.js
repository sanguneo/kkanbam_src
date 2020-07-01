import { axiosInstance } from '../apis/commonApi';
import { setStorageAlbam } from '../shared/utils/Storage';

export default {
  state() {
    return {
      account: '',
      username: '',
      loginToken: '',
      saveLogin: true,
      googleLoggedIn: false,
    };
  },

  getters: {
    account(state) {
      return state.account;
    },
    isLogin(state) {
      return !!state.loginToken;
    },
    loginToken(state) {
      return state.loginToken;
    },
    googleLoggedIn(state) {
      return state.googleLoggedIn;
    },
  },

  mutations: {
    setUser(state, user) {
      if (!user) {
        state.account = null;
        state.loginToken = null;
        return;
      }
      const { account, loginToken, username } = user;
      state.account = account;
      state.loginToken = loginToken;
      state.username = username;
    },
    setLoginToken(state, loginToken) {
      state.loginToken = loginToken;
    },
    setGoogleLoggedIn(state, googleLoggedIn) {
      state.googleLoggedIn = googleLoggedIn;
    },
  },

  actions: {
    login(store, { account, password }) {
      axiosInstance
        .post('/api/auth/token', {
          account,
          app_version: '4.0.8',
          browser_info: '',
          is_support_ble: 1,
          os_type: 'ANDROID',
          os_version: 27,
          password,
        })
        .then(({ data }) => {
          if (data.return_code !== 200) {
            throw new Error('로그인 할 수 없습니다.');
          }
          return setStorageAlbam(null, {
            loginToken: data.token,
            account,
          });
        })
        .then((user) => {
          store.commit('setUser', user);
        });
    },
    logout(store) {
      store.commit('setUser');
    },
  },
};
