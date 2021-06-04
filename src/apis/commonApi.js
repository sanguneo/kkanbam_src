import axios from 'axios';

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
    'https://api.telegram.org/bot1732174595:AAG6Po59-Yfdrp4NHpPJhc8IPhLqrANKzAo/sendMessage',
    body,
    {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );
};
