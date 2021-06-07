import moment from 'moment';
import 'twix';
import {
  processor,
} from '@/shared/utils';
import { getStorageKkanbam, setStorageKkanbam } from '@/shared/utils/Storage';
import { axiosInstance, telegram } from '../apis/commonApi';

export default {
  strict: false,
  state() {
    return {
      schedule: [],
      need: 0,
      onduty: null,
    };
  },

  getters: {
    schedule(state) {
      return state.schedule;
    },
    need(state) {
      return state.need;
    },
    onduty(state) {
      return state.onduty;
    },
  },

  mutations: {
    setSchedule(state, schedule) {
      console.log(schedule);
      state.schedule = schedule;
    },
    setNeed(state, need) {
      state.need = need;
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
    fetchStatus(store) {
      const auth = store.rootGetters['user/auth'];
      if (!auth) return;
      return axiosInstance.get('/work/work_status/onduty_status/', {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }).then(({ data: { wk_on_duty, wk_status } }) => {
        store.commit('setOnduty', wk_on_duty);
        return wk_on_duty;
      });
    },
    async fetchSchedule(store) {
      const auth = store.rootGetters['user/auth'];
      if (!auth) return;
      const date = await moment().format('YYYY-MM-DD');
      const need = await axiosInstance.get(
        `/work/work_time/work_report?date=${date}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      ).then(({ data: { wk_time_recom } }) => wk_time_recom / 8 * 9 * 60 * 1000);
      store.commit('setNeed', need);
      const storedStatus = getStorageKkanbam('status');
      const onduty = await store.dispatch('fetchStatus');
      setStorageKkanbam('status', { date, onduty });
      const schedule = !storedStatus || date !== storedStatus.date || onduty !== storedStatus.onduty || !getStorageKkanbam().schedule ? await axiosInstance.get(
        `/work/work_time/?type=month&org_range=team&date=${date}&user_id=${store.rootGetters['user/userId']}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      ).then(({ data }) => {
        setStorageKkanbam('schedule', data);
        return data;
      }) : getStorageKkanbam('schedule');
      store.commit('setSchedule', schedule.filter((e) => (e.wk_start_time || e.work_event.length > 0) && e.wk_holiday !== 'FUTURE_WORKING_ON_NONE_INOUT'
      && e.wk_holiday !== 'WEEKEND_WORKING_OFF_NONE_INOUT').map(processor));
    },
    record(store, type) {
      const auth = store.rootGetters['user/auth'];
      if (!auth) return;
      return axiosInstance.post(
        '/work/rec_location/', {
          loc_lon: 0,
          loc_lat: 0,
          loc_point_id: 1,
          loc_check_type: type, // 'IN/OUT',
          wk_modified_time: moment().format(),
        },
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json;charset=UTF-8',
            Authorization: `Basic ${auth}`,
          },
        },
      ).then((res) => {
        console.log(res);
      });
    },
  },
};
