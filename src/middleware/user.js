import { axiosInstance } from '@/apis/commonApi';
import { getStorageKkanbam } from '@/shared/utils/Storage';

export default ({
  route, redirect, error, store, app: { router },
}) => {
  if (process.server) return;
  const account = getStorageKkanbam('account');
  if (!account) return;
  const {
    email, auth, username, userId,
  } = JSON.parse(decodeURIComponent(escape(atob(account))));

  store.commit('user/setEmail', email);
  store.commit('user/setAuth', auth);
  store.commit('user/setUserId', userId);
  store.commit('user/setUsername', username);
};
