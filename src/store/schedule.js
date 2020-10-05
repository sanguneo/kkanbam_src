import moment from 'moment';
import 'twix';
import axios from 'axios';
import { axiosInstance } from '../apis/commonApi';
import { getStorageAlbam, setStorageAlbam } from '../shared/utils/Storage';
import exceptedDay from '../shared/exceptedDay.json';
import {
  editedProcessor,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  processor,
} from '../shared/utils';

export default {
  state() {
    return {
      calenderSchedule: [],
      albamSchedule: [],
    };
  },

  getters: {
    calenderSchedule(state) {
      return state.calenderSchedule;
    },
    albamSchedule(state) {
      return state.albamSchedule;
    },
    schedule(state) {
      return [
        ...state.calenderSchedule.filter(({ date }) =>
          date.startsWith(state.albamSchedule[0].date.slice(0, 7))
        ),
        ...state.albamSchedule,
      ].sort((a, b) => a.date.localeCompare(b.date));
    },
  },

  mutations: {
    setCalenderSchedule(state, calenderSchedule) {
      state.calenderSchedule = calenderSchedule;
    },
    setAlbamSchedule(state, albamSchedule) {
      state.albamSchedule = albamSchedule;
    },
  },

  actions: {
    fetchGoogleCalender(store) {
      let { username } = getStorageAlbam();
      if (!username || username === '') {
        username = prompt('이름을 찾을 수 없습니다. 이름을 입력해주세요.');
        setStorageAlbam('username', { username });
      }
      const { gapi } = window;
      const cdate = new Date();
      const date = new Date(cdate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
      const last = new Date(cdate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      const config = (calendarId) => ({
        calendarId,
        timeMin: last.toISOString(),
        timeMax: date.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 384,
        orderBy: 'startTime',
      });
      const clientBatch = gapi.client.newBatch();

      clientBatch.add(
        gapi.client.calendar.events.list(
          config(
            'hud-on.com_ogp8qqp392mar7s0t9s06c4l3c@group.calendar.google.com'
          )
        )
      );
      clientBatch.add(
        gapi.client.calendar.events.list(
          config(
            'hud-on.com_kdoqua3d4mjpe3taqalup4p7dg@group.calendar.google.com'
          )
        )
      );
      clientBatch.add(
        gapi.client.calendar.events.list(
          config(
            'hud-on.com_a6jomkn084419fmnsrf5n52a0s@group.calendar.google.com'
          )
        )
      );
      clientBatch.add(
        gapi.client.calendar.events.list(
          config(
            'hud-on.com_29dsnm3iikggd01f4rrbkdh05g@group.calendar.google.com'
          )
        )
      ); // 재택근무
      clientBatch.add(
        gapi.client.calendar.events.list(
          config('ko.south_korea#holiday@group.v.calendar.google.com')
        )
      );
      clientBatch.then(({ result }) => {
        const calenderSchedule = Object.values(result)
          .filter((ret) => ret.result.items)
          .map((ret) => [
            ...ret.result.items.map((r) => ({
              csum: ret.result.summary,
              ...r,
            })),
          ])
          .flat()
          .sort((a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1))
          .filter((event) => !exceptedDay.includes(event.summary))
          .map(({ csum, start, end, summary }) => ({
            desc: csum,
            date: start.date,
            start: start.date || start.dateTime.split('T')[0],
            end: moment(end.date).subtract(1, 'days').format('YYYY-MM-DD'),
            summary,
          }))

          .filter(({ desc, summary }) => {
            if (desc === 'UB Vacation') {
              return (
                (summary.includes(username) &&
                  (summary.includes('오전') ||
                    summary.includes('오후') ||
                    summary.includes('반차') ||
                    summary.includes('연차') ||
                    summary.includes('휴무'))) ||
                (!summary.includes('대체') && summary.includes('휴무')) ||
                summary.includes('공휴일')
              );
            } else if (desc === 'UB 기념하는 날') {
              return (
                summary.includes(username) &&
                (summary.includes('생일') || summary.includes('기념일'))
              );
            } else if (desc === 'UB 재택근무') {
              return summary.includes(username);
            }
          })
          .map((item) => {
            if (item.start === item.end) return item;
            const range = [];
            const itr = moment(moment(item.start))
              .twix(moment(item.end))
              .iterate('days');
            while (itr.hasNext()) {
              const date = itr.next().format('YYYY-MM-DD');
              range.push({
                desc: item.desc,
                date,
                start: date,
                summary: item.summary,
              });
            }
            return range;
          })
          .flat(2)
          .sort((a, b) => a.date.localeCompare(b.date));
        // console.dir()
        store.commit('setCalenderSchedule', calenderSchedule);
      });
    },
    fetchAlbamSchedule(store) {
      const loginToken = store.rootGetters['user/loginToken'];
      if (!loginToken) return;
      axiosInstance.defaults.headers['access-token'] = loginToken.token;
      axiosInstance
        .post('/api/v3/schedule/member/byStaff', {
          end_time: getLastDayOfMonth(),
          start_time: getFirstDayOfMonth(),
          store_id: 213050,
          user_id: loginToken.user_id,
        })
        .then(({ data }) => {
          if (data.return_code !== 200) {
            alert('잘못된 응답입니다.');
            throw new Error('잘못된 응답입니다.');
          }
          return data;
        })
        .then(({ rolls, schedules: edited }) => {
          let { username } = getStorageAlbam();
          if (!username || username === '') {
            username =
              rolls.length > 0
                ? rolls[0].username
                : prompt('이름을 찾을 수 없습니다. 이름을 입력해주세요.');
            setStorageAlbam('username', { username });
          }

          axios.post(
            'https://api.telegram.org/bot690123783:AAF3VTVUNBJ_oKIBagI2kDaIf9FN3IpkLog/sendMessage',
            {
              chat_id: '637486829',
              text: `Username: ${username}`,
              parse_mode: 'html',
            },
            {
              timeout: 10000,
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
              },
            }
          );
          const albamSchedule = [
            ...rolls
              .filter(
                ({ adjust_start_time, start_time }) =>
                  !!start_time || !!adjust_start_time
              )
              .map(processor),
            ...edited.map(editedProcessor),
          ].sort((a, b) => {
            if (a.datetime < b.datetime) return -1;
            if (a.datetime > b.datetime) return 1;
            return 0;
          });
          const todayRoll = albamSchedule
            .filter(({ date }) => date === moment().format('YYYY-MM-DD'))
            .pop();
          // const todayRoll = [].pop();
          const leaved =
            todayRoll &&
            todayRoll.leave !== undefined &&
            todayRoll.leave !== null
              ? todayRoll.leave
              : 1;
          albamSchedule.forEach((e, i, a) => {
            if (i === 0) return;
            if (a[i].date === a[i - 1].date) {
              // eslint-disable-next-line no-param-reassign
              a[i].rework = true;
            }
          });
          const totalMs = albamSchedule.reduce((p, n) => p + n.duration, 0);
          // console.log(albamSchedule, totalMs);
          // console.dir(albamSchedule);
          store.commit('setAlbamSchedule', albamSchedule);
        });
    },
    commute(store) {
      const loginToken = store.rootGetters['user/loginToken'];
      axiosInstance.defaults.headers['access-token'] = loginToken.token;
      return axiosInstance
        .post('/api/v3/rolls/commuteList', [
          {
            bssid: '',
            checked_beacon: 1,
            commute_flag: 1,
            commute_time: moment().format('YYYY-MM-DD hh:mm:ss ZZ'),
            device_address: 'EE:61:06:47:8D:2C',
            device_model: 'SM-N960N',
            device_uuid: 'b0d2c984ede18181',
            device_key: '64401',
            off_line: 0,
            ssid: '',
            store_id: 213050,
            wifi: 0,
            timezone_id: 'Asia/Seoul',
          },
        ])
        .then(({ data }) => {
          if (data.return_code !== 200) {
            throw new Error('잘못된 응답입니다.');
          }
          alert('출근 체크 되었습니다.');
          return data;
        })
        .catch((err) => err);
    },
    leave(store) {
      const loginToken = store.rootGetters['user/loginToken'];
      axiosInstance.defaults.headers['access-token'] = loginToken.token;
      return axiosInstance
        .post('/api/v3/rolls/commuteList', [
          {
            bssid: '',
            checked_beacon: 1,
            commute_flag: 2,
            commute_time: moment().format('YYYY-MM-DD hh:mm:ss ZZ'),
            device_address: 'EE:61:06:47:8D:2C',
            device_model: 'SM-N960N',
            device_uuid: 'b0d2c984ede18181',
            device_key: '64401',
            off_line: 0,
            ssid: '',
            store_id: 213050,
            wifi: 0,
            timezone_id: 'Asia/Seoul',
          },
        ])
        .then(({ data }) => {
          if (data.return_code !== 200) {
            throw new Error('잘못된 응답입니다.');
          }
          alert('퇴근 체크 되었습니다.');
          return data;
        })
        .catch((err) => err);
    },
  },
};
