import axios from 'axios';

axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({
  baseURL: 'https://api.commonspace.ai',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    accept: 'application/json;charset=UTF-8',
  },
});
export const telegram = (text) => {
  const body = {
    chat_id: '637486829',
    text,
    parse_mode: 'html',
  };
  axios.post(
    'https://api.telegram.org/bot690123783:AAF3VTVUNBJ_oKIBagI2kDaIf9FN3IpkLog/sendMessage',
    body,
    {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );
};
