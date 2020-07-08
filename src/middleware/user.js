import { getStorageAlbam } from '../shared/utils/Storage';

export default ({ route, redirect, error, store, app: { router } }) => {
  if (process.server) return;
  const user = getStorageAlbam();
  store.commit('user/setUser', user);
  if (!user || !user.account || !user.loginToken) {
    return;
  }
  return true;
};
