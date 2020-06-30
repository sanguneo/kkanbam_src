import moment from 'moment';

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
  let minutes = Math.floor(duration / (1000 * 60)) % 60;
  let hours = Math.floor(duration / (1000 * 60 * 60));

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${negative ? '-' : ''}${hours}h${minutes}m`;
}

export const processor = ({
  adjust_start_time,
  adjust_end_time,
  start_time,
  end_time,
  store_name,
  username,
}) => {
  let r_starttime = adjust_start_time || start_time;
  const r_endtime = adjust_end_time || end_time || Date.now();
  const eightAM = (() => { const ret = new Date(r_starttime); ret.setHours(8, 0, 0, 0); return ret.getTime(); })();
  r_starttime = r_starttime > eightAM ? r_starttime : eightAM;
  return {
    date: moment(new Date(r_starttime)).format('YYYY-MM-DD'),
    start: moment(new Date(r_starttime)).format('HH:mm'),
    end: moment(new Date(r_endtime)).format('HH:mm'),
    leave: adjust_end_time || end_time ? 1 : 0,
    duration: r_endtime - r_starttime,
    durationString: msToTime(r_endtime - r_starttime),
    before8: r_starttime < eightAM,
  };
};

export const editedProcessor = ({ start_time }) => ({
  date: moment(new Date(start_time)).format('YYYY-MM-DD'),
  start: moment(new Date(start_time)).format('YYYY-MM-DD HH:mm:ss'),
  end: 0,
  leave: -1,
  duration: 1000 * 60 * 60 * 9,
  durationString: '휴무or외부',
});

export const holidayProcessor = ({
  desc, date, summary, days,
}, myname) => {
  let isPersonal = true;
  if ([0, 6].includes(new Date(date).getDay())) return;
  if (desc === '대한민국의 휴일') {
    isPersonal = false;
  } else if (desc === 'UB Vacation') {
    if (!summary.includes(myname)) {
      isPersonal = false;
      if (!((summary.includes('UB') || summary.includes('직원')) && summary.includes('휴무'))) return;
    }
  } else if (desc === 'UB 외근/출장일정') {
    if (!summary.includes(myname)) {
      isPersonal = false;
      return;
    }
  } else if (desc === 'UB 공식일정/행사') {
    if (summary.includes('Conference') || summary.includes('워크샵') || summary.includes('휴무')) {
      isPersonal = false;
    } else return;
  }
  const start_time = new Date(date).getTime();
  return {
    date: moment(new Date(start_time)).format('YYYY-MM-DD'),
    start: moment(new Date(start_time)).format('HH:mm'),
    end: 0,
    leave: -1,
    duration: 1000 * 60 * 60 * (days === 0.5 ? 4 : 9),
    durationString: (desc.includes('대한민국의 휴일') || !isPersonal) ? summary : summary.substr(summary.indexOf(' ')).replace('오전', '')
      .replace('오후', ''),
  };
};

export function convertPhoneNumber(p) {
  if (p.charAt(0) === '0' && !p.includes('@')) {
    p = p.slice(1);
    p = `82${p}`;
  }
  return p;
}
