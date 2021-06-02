export const getStorage = (key = null) => (key
  ? JSON.parse(window.localStorage[key] || '{}')
  : Object.fromEntries(Object.entries(window.localStorage).map(([k, v]) => [k, JSON.parse(v)])));
export const setStorage = (key, value) => {
  window.localStorage[key] = typeof value === 'object' ? JSON.stringify(value) : value;
};

export const getStorageKkanbam = (key = null) => {
  const kkanbamData = getStorage('kkanbamData');
  return key ? kkanbamData[key] : kkanbamData;
};

export const setStorageKkanbam = (key, value, legacy) => {
  const kkanbamData = getStorage('kkanbamData');
  if (key) {
    kkanbamData[key] = value;
  } else {
    Object.assign(kkanbamData, value);
  }
  setStorage('kkanbamData', legacy ? value : kkanbamData);
  return value;
};

export const clearStorage = (key = null) => {
  if (!key) localStorage.clear();
  else localStorage.removeItem(key);
};
export const clearKkanbamStorage = (key = null) => {
  const kkanbamData = getStorage('kkanbamData');
  if (key) {
    delete kkanbamData[key];
    setStorageKkanbam(null, kkanbamData, true);
  } else clearStorage('kkanbamData');
};
