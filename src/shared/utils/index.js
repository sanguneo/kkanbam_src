import moment from 'moment';
import expectedDay from '../exceptedDay.json';


export const weekwork = (time = 45) => 1000 * 60 * 60 * time;

export function getFirstDayOfMonth(tday = new Date()) {
  const d = tday;
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}
export function getLastDayOfMonth(tday = new Date()) {
  const d = tday;
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime() - 1;
}

export function msToTime(dur) {
  const negative = dur < 0;
  const duration = Math.abs(dur);
  const minutes = (Math.floor(duration / (1000 * 60)) % 60).toString()
    .padStart(2, '0');
  const hours = (Math.floor(duration / (1000 * 60 * 60))).toString()
    .padStart(2, '0');

  return `${negative ? '-' : ''}${hours}:${minutes}`;
}

const setAfter8 = (date) => {
  const eightAM = new Date(date);
  eightAM.setHours(8, 0, 0, 0);
  return date < eightAM ? eightAM : date;
};

export const editedProcessor = ({ wk_date, start_time, work_event }) => ({
  date: moment(new Date(start_time)).format('YYYY-MM-DD'),
  start: '0',
  end: '0',
  duration: 1000 * 60 * 60 * 9,
  durationString: `${work_event || expectedDay[wk_date] || '휴무/외부'}\t09:00`,
});

export const processor = ({
  wk_date,
  wk_start_time,
  wk_start_time_sch,
  wk_end_time,
  wk_end_time_sch,
  wk_holiday,
  work_event,
}) => {
  if (wk_holiday === 'HOLIDAY_WORKING_OFF_NONE_INOUT'
    || wk_holiday === 'FUTURE_WORKING_ON_OFFEVENT_NONE') return editedProcessor({ wk_date, start_time: wk_date, work_event: work_event.length > 0 && work_event[0].wk_event.split(':').pop() });
  let vacation = 0;
  if (work_event.some(({ wk_event }) => wk_event === 'VACATION:AM')) vacation = 1;
  else if (work_event.some(({ wk_event }) => wk_event === 'VACATION:PM')) vacation = 2;
  const home = work_event.some(({ wk_event }) => wk_event === 'HOME');
  const startTimeObject = new Date(wk_start_time || (home ? wk_start_time_sch : new Date()));
  const starttime = setAfter8(startTimeObject);
  const endtime = wk_end_time ? new Date(wk_end_time) : new Date((home && !wk_start_time && !wk_end_time ? wk_end_time_sch : new Date()));
  const rt = {
    date: moment(new Date(starttime)).format('YYYY-MM-DD'),
    start: moment(new Date(starttime)).format('HH:mm'),
    end: moment(new Date(endtime)).format('HH:mm'),
    duration: endtime.getTime() - starttime.getTime(),
    before8: startTimeObject !== starttime,
    summary: home ? '재택근무\t' : '',
    event: home,
  };
  rt.durationString = (vacation === 1 ? '오전반차\n' : '') + msToTime(rt.duration) + (vacation === 2 ? '\n오후반차' : '');
  rt.duration += vacation === 0 ? 0 : 18000000;
  return rt;
};


export function convertPhoneNumber(p) {
  if (p.charAt(0) === '0' && !p.includes('@')) {
    p = p.slice(1);
    p = `82${p}`;
  }
  return p;
}
