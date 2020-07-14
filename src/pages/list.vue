<template>
  <div class="listPage">
    <div class="whatWeek">
      {{ thisMonth }}
      <!--      <span onClick={() => scheduleActions.moveWeek('p')}>P </span>-->
      <!--      {moment(scheduleState.thisMonday).format('YYYY-MM-DD')} ~ {moment(scheduleState.thisMonday + 518400000).format('YYYY-MM-DD')}-->
      <!--      <span onClick={() => scheduleActions.moveWeek('n')}> N</span>-->
    </div>
    <div contentEditable class="content">
      {{ schedule.length === 0 ? '작성된 일정이 없습니다.' : '' }}
      <br v-if="schedule.length === 0" />
      <Item
        :key="`${roll.start}_${idx}`"
        v-for="(roll, idx) in schedule"
        :date="roll.date"
        :week="roll.week"
        :weekIndex="roll.week | getWeekIndex"
        :weekFirst="roll.weekFirst"
        :start="roll.start"
        :end="roll.end"
        :durationString="roll.durationString"
        :summary="roll.summary"
        :same-date="idx > 0 ? roll.date === schedule[idx - 1].date : false"
        :spreaded="weeksOnMonth[roll.week]"
        @spread="spread(roll.week)"
      />
      <br />
      WorkToGo : {{ need | msToTime }}<br />
      Worked : {{ mine | msToTime }}<br />
      Remain : {{ remain }}<br /><br />
      <span
        v-if="
          account.startsWith('sknah') ||
          account.startsWith('gyu') ||
          myip.office
        "
        @click="commuteLeave"
        href="javascript:;"
        class="commute"
      >
        {{ leaved ? 'Commute' : 'Leave' }} </span
      ><br />
    </div>
    <!--    {(state.account.startsWith('sknah') || connectionState.office) && (leaved !== -1 && (leaved === 0-->
    <!--    ? <div className="commute" style={{ top }} onClick={leave}>Leave</div>-->
    <!--    : <div className="commute" style={{ top }} onClick={commute}>Commute</div>))}-->
    <div :style="{ top: top - 25 + 'px' }" class="debug">
      {{ myip.ip }}
    </div>
    <div :style="{ top: top + 'px' }" class="logout">Logout</div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  msToTime,
} from '../shared/utils';
import '../shared/myip';

function weeksOnMonth() {
  const fw = moment(getFirstDayOfMonth()).week();
  const lw = moment(getLastDayOfMonth()).week();
  return Array(lw - fw + 1)
    .fill(null)
    .map((_, i) => i + fw);
}

export default {
  name: 'List',
  filters: {
    msToTime(value) {
      return msToTime(value);
    },
    getWeekIndex(week) {
      return weeksOnMonth().findIndex((w) => w === week) + 1;
    },
  },
  data() {
    return {
      weeksOnMonth: Object.fromEntries(
        weeksOnMonth().map((value) => [value, true])
      ),
      myip: {
        ip: '127.0.0.1',
        office: false,
        changed: false,
      },
      top: 0,
    };
  },
  computed: {
    thisMonth() {
      return moment().format('YYYY년 MM월');
    },
    account() {
      return this.$store.getters['user/account'];
    },
    schedule() {
      const weekList = weeksOnMonth();
      return this.$store.getters['schedule/schedule'].map((item) => {
        return {
          ...item,
          week: moment(item.date).week(),
          weekFirst:
            moment(item.date).week() === weekList[0] && !!weekList.shift(),
        };
      });
    },
    leaved() {
      return (
        (this.schedule &&
        this.schedule.filter((e) => !e.summary) &&
        this.schedule.filter((e) => !e.summary).slice(-1)[0] &&
        this.schedule.filter((e) => !e.summary).slice(-1)[0].leave
          ? this.schedule.filter((e) => !e.summary).slice(-1)[0].leave
          : 0) !== 0
      );
    },
    mine() {
      return this.$store.getters['schedule/schedule'].reduce((acc, curr) => {
        return (
          acc +
          (curr.duration ||
            (curr.summary.includes('반차') ||
            curr.summary.includes('오전') ||
            curr.summary.includes('오후')
              ? 14400000
              : 32400000))
        );
      }, 0);
    },
    need() {
      const range = [];
      const itr = moment(moment(getFirstDayOfMonth()))
        .twix(moment(getLastDayOfMonth()))
        .iterate('days');
      while (itr.hasNext()) {
        const date = itr.next().toDate();
        range.push(date.getDay());
      }
      return (
        range.filter((r) => ![0, 6].includes(r)).length * 9 * 60 * 60 * 1000
      );
    },
    remain() {
      return (
        (this.need < this.mine ? '(초과)' : '') +
        msToTime(Math.abs(this.need - this.mine))
      );
    },
  },
  created() {
    const _this = this;
    window.onOffice.callback = function () {
      _this.myip = this.toJSON();
    };
  },
  mounted() {
    this.$store.dispatch('schedule/fetchAlbamSchedule');
    window.addEventListener('resize', () => {
      this.top = (Math.floor(window.innerHeight / 25) - 1) * 25;
    });
    this.top = (Math.floor(window.innerHeight / 25) - 1) * 25;
  },
  methods: {
    spread(week) {
      this.weeksOnMonth[week] = !this.weeksOnMonth[week];
    },
    commuteLeave() {
      if (this.leaved) {
        this.$store.dispatch('schedule/commute');
      } else {
        this.$store.dispatch('schedule/leave');
      }
    },
  },
};
</script>

<style lang="scss">
.listPage {
  width: 100%;
  min-height: 100%;
  & > .whatWeek {
    margin-bottom: 25px;
    & > span {
      &:first-child {
        margin-right: 20px;
      }
      &:last-child {
        margin-left: 20px;
      }
    }
  }
  & > .content {
    margin-top: 25px;
    height: calc(100% - 75px);
    & > .item {
      /*white-space: pre;*/
      & > .durationString {
        font-weight: bold;
      }
    }
  }
  /*.commute {*/
  /*  position: fixed;*/
  /*}*/
  .debug {
    position: fixed;
    right: 25px;
  }
  .logout {
    position: fixed;
    right: 25px;
  }
}
</style>
