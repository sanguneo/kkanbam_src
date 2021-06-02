import { axiosInstance } from '../apis/commonApi';
import { setStorageKkanbam } from '../shared/utils/Storage';

export default {
  state() {
    return {
      email: null,
      auth: null,
      userId: null,
      username: null,
      onduty: null,
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
    onduty(state) {
      return state.onduty;
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
    setOnduty(state, onduty) {
      if (!onduty) {
        state.onduty = null;
        return;
      }
      state.onduty = onduty;
    },
  },

  actions: {
    async login(store, { email, password, saveLogin }) {
      await axiosInstance.post('/user/get_token/', {
        email,
        password,
      });
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
      location.href = '/';
    },
    fetchStatus(store) {
      const { auth } = store.getters;
      if (!auth) return;
      return axiosInstance.get('/work/work_status/onduty_status/', {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }).then(({ data: { wk_on_duty, wk_status } }) => {
        store.commit('setOnduty', wk_on_duty);
      });
    },
  },
};
