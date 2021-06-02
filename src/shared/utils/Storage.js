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
  setStorage('kkanbamData', legacy ? value : Object.assign(kkanbamData, value));
  return value;
};
