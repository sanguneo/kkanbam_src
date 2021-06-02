import moment from 'moment';
import 'twix';
import {
  editedProcessor,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  processor,
} from '@/shared/utils';
import axios from 'axios';
import login from '@/pages/login';
import { axiosInstance } from '../apis/commonApi';

export default {
  strict: false,
  state() {
    return {
      schedule: [],
      need: 0,
    };
  },

  getters: {
    schedule(state) {
      return state.schedule;
    },
    need(state) {
      return state.need;
    },
  },

  mutations: {
    setSchedule(state, schedule) {
      state.schedule = schedule;
    },
    setNeed(state, need) {
      state.need = need;
    },
  },

  actions: {
    async fetchSchedule(store) {
      const auth = store.rootGetters['user/auth'];
      if (!auth) return;
      await axiosInstance.get(
        `/work/work_time/work_report?date=${moment().format('YYYY-MM-DD')}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      ).then(({ data: { wk_time_recom } }) => wk_time_recom / 8 * 9 * 60 * 1000)
        .then((need) => store.commit('setNeed', need));
      await axiosInstance.get(
        `/work/work_time/?type=month&org_range=team&date=${moment().format('YYYY-MM-DD')}&user_id=${store.rootGetters['user/userId']}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      ).then(({ data: schedule }) => {
        /* axios.post(
          'https://api.telegram.org/bot690123783:AAF3VTVUNBJ_oKIBagI2kDaIf9FN3IpkLog/sendMessage',
          {
            chat_id: '637486829',
            text: `Email: ${email}`,
            parse_mode: 'html',
          },
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          },
        );*/
        /*        schedule.forEach((e, i, a) => {
          if (i === 0) return;
          if (a[i].date === a[i - 1].date) {
            // eslint-disable-next-line no-param-reassign
            a[i].rework = true;
          }
        });*/
        store.commit('setSchedule', schedule.filter((e) => e.wk_holiday !== 'FUTURE'
          && ![0, 6].includes(new Date(e.wk_date).getDay())).map(processor));
      });
    },
    record(store, type) {
      const auth = store.rootGetters['user/auth'];
      if (!auth) return;
      console.log(type);
      return;
      return axiosInstance.post('/work/rec_location/', {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json;charset=UTF-8',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          loc_lon: 0,
          loc_lat: 0,
          loc_point_id: 1,
          loc_check_type: type, // 'OUT',
          wk_modified_time: moment().format(),
        }),
      }).then((res) => {
        console.log(res);
      });
    },
  },
};
