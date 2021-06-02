import { axiosInstance } from '../apis/commonApi';
import { clearKkanbamStorage, setStorageKkanbam } from '../shared/utils/Storage';

export default {
  state() {
    return {
      email: null,
      auth: null,
      userId: null,
      username: null,
      currentIP: '127.0.0.1',
    };
  },

  getters: {
    email(state) {
      return state.email;
    },
    auth(state) {
      return state.auth;
    },
    isLogin(state) {
      return !!state.email;
    },
    userId(state) {
      return state.userId;
    },
    username(state) {
      return state.username;
    },
    currentIP(state) {
      return state.currentIP;
    },
  },

  mutations: {
    setEmail(state, email) {
      if (!email) {
        state.email = null;
        return;
      }
      state.email = email;
    },
    setAuth(state, auth) {
      if (!auth) {
        state.auth = null;
        return;
      }
      state.auth = auth;
    },
    setUserId(state, userId) {
      if (!userId) {
        state.userId = null;
        return;
      }
      state.userId = userId;
    },
    setUsername(state, username) {
      if (!username) {
        state.username = null;
        return;
      }
      state.username = username;
    },
    setCurrentIP(state, currentIP) {
      if (!currentIP) {
        state.currentIP = '127.0.0.1';
        return;
      }
      state.currentIP = currentIP;
    },
  },

  actions: {
    async login(store, { email, password, saveLogin }) {
      const auth = btoa(`${email}:${password}`);
      const {
        data: { user_profile: { username, user_id: userId } },
      } = await axiosInstance.get('/user/users/get_profile/', {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      if (saveLogin) {
        setStorageKkanbam(null, {
          account: btoa(unescape(encodeURIComponent(JSON.stringify({
            email,
            auth,
            userId,
            username,
          })))),
          saveLogin,
        });
      }
      store.commit('setEmail', email);
      store.commit('setAuth', auth);
      store.commit('setUserId', userId);
      store.commit('setUsername', username);
    },
    logout(store) {
      store.commit('setEmail');
      store.commit('setAuth');
      store.commit('setUserId');
      store.commit('setUsername');
      clearKkanbamStorage();
      location.href = '/';
    },
    getCurrentIp(store) {
      const { auth } = store.getters;
      if (!auth) return;
      return axiosInstance.get('/user/wifi/', {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }).then(({ data: [{ wifi_address }] }) => {
        store.commit('setCurrentIP', wifi_address);
        return wifi_address;
      });
    },
  },
};
