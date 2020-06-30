import { getStorageAlbam } from '../shared/utils/Storage';

export default ({ route, redirect, error, store, app: { router } }) => {
  if (process.server) return;
  store.commit('user/setUser', getStorageAlbam());
  return true;
};
