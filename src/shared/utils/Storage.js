export const getStorage = (key = null) => (key ? JSON.parse(window.localStorage[key] || '{}') : Object.fromEntries(Object.entries(window.localStorage).map(([k, v]) => ([k, JSON.parse(v)]))));
export const setStorage = (key, value) => {
  window.localStorage[key] = (typeof value === 'object') ? JSON.stringify(value) : value;
};

export const getStorageAlbam = (key = null) => {
  const albamData = getStorage('albamData');
  return key ? albamData[key] : albamData;
};

export const setStorageAlbam = (key, value, legacy) => {
  const albamData = getStorage('albamData');
  if (key) {
    albamData[key] = value;
  } else {
    Object.assign(albamData, value);
  }
  setStorage('albamData', legacy ? value : Object.assign(albamData, value));
  return value;
};
