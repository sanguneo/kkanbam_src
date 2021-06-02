<template>
  <div class="listPage">
    <div class="whatWeek">
      {{ thisMonth }}
      <!--      <span onClick={() => scheduleActions.moveWeek('p')}>P </span>-->
      <!--      {moment(scheduleState.thisMonday).format('YYYY-MM-DD')} ~ {moment(scheduleState.thisMonday + 518400000).format('YYYY-MM-DD')}-->
      <!--      <span onClick={() => scheduleActions.moveWeek('n')}> N</span>-->
    </div>
    <div class="content">
      {{ schedule.length === 0 ? '작성된 일정이 없습니다.' : '' }}
      <br v-if="schedule.length === 0" />
      <Item
        v-for="(roll, idx) in schedule"
        :key="`${roll.start}_${idx}`"
        :date="roll.date"
        :week="roll.week"
        :week-index="roll.week | getWeekIndex"
        :week-first="roll.weekFirst"
        :start="roll.start"
        :end="roll.end"
        :duration-string="roll.durationString"
        :summary="roll.summary"
        :same-date="idx > 0 ? roll.date === schedule[idx - 1].date : false"
        :spreaded="weeksOnMonth[roll.week]"
        @spread="spread(roll.week)" />
      <br />
      WorkToGo : {{ need | msToTime }}<br />
      Worked : {{ mine | msToTime }}<br />
      Fully : {{ daywork }}<br />
      Remain : {{ remain }}<br /><br />
      <span v-show="inOffice" class="commute" @click="commuteLeave">
        {{ leaved ? 'Commute' : 'Leave' }} </span><br />
    </div>
    <!--    {(state.account.startsWith('sknah') || connectionState.office) && (leaved !== -1 && (leaved === 0-->
    <!--    ? <div className="commute" style={{ top }} onClick={leave}>Leave</div>-->
    <!--    : <div className="commute" style={{ top }} onClick={commute}>Commute</div>))}-->
    <div :style="{ top: top - 25 + 'px' }" class="debug">
      {{ myip.ip }}
    </div>
    <div :style="{ top: top + 'px' }" class="logout" @click="logout">Logout</div>
    <Wave v-show="fetching" class="fetching" />
  </div>
</template>

<script>
import moment from 'moment';
import Wave from '~/components/Wave.vue';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  msToTime,
} from '../shared/utils';

function weeksOnMonth(date = new Date()) {
  const fw = moment(getFirstDayOfMonth(date)).week();
  const lw = moment(getLastDayOfMonth(date)).week();
  return Array(fw < lw ? lw - fw + 1 : 5)
    .fill(null)
    .map((_, i) => i + fw);
}

export default {
  name: 'List',
  components: {
    Wave,
  },
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
      fetching: false,
      weeksOnMonth: Object.fromEntries(weeksOnMonth().map((value, idx) => [value, true])),
      myip: {
        ip: '127.0.0.1',
      },
      top: 0,
    };
  },
  computed: {
    inOffice() {
      return this.$store.getters['user/currentIP'] === this.myip.ip;
    },
    thisMonth() {
      return moment().format('YYYY년 MM월');
    },
    account() {
      return this.$store.getters['user/account'];
    },
    schedule() {
      const weekList = Object.keys(this.weeksOnMonth).map((e) => parseInt(e, 10));
      return (this.$store.getters['schedule/schedule'] || []).map((item, i) => {
        let weekFirst = false;
        const shift = weekList.findIndex((week) => week === moment(item.date).week());
        if (shift) {
          for (let cnt = 0; cnt < shift; cnt += 1) {
            weekFirst = !!weekList.shift();
          }
        }
        return {
          ...item,
          week: moment(item.date).week(),
          weekFirst: i === 0 || weekFirst,
        };
      });
    },
    leaved() {
      return this.$store.getters['schedule/onduty'] !== 'WORKING';
    },
    mine() {
      return (this.$store.getters['schedule/schedule'] || []).reduce((acc, curr) => (acc + curr.duration), 0);
    },
    need() {
      return this.$store.getters['schedule/need'];
    },
    remain() {
      return (
        (this.need < this.mine ? '(초과)' : '')
        + msToTime(Math.abs(this.need - this.mine))
      );
    },
    daywork() {
      return msToTime(Array.from(new Set(this.schedule.map((e) => e.date))).length
          * 9
          * 60
          * 60
          * 1000);
    },
  },
  created() {
    window.getip = (info) => {
      this.myip = info;
    };
    const script = document.createElement('script');
    script.src = 'https://api.ipify.org?format=jsonp&callback=getip';
    document.head.appendChild(script);
  },
  async mounted() {
    this.fetching = true;
    if (this.$store.getters['user/isLogin']) {
      await Promise.all([
        this.$store.dispatch('user/getCurrentIp'),
        this.$store.dispatch('schedule/fetchStatus'),
        this.$store.dispatch('schedule/fetchSchedule'),
      ]);
    }
    this.fetching = false;
    window.addEventListener('resize', () => {
      this.top = (Math.floor(window.innerHeight / 25) - 1) * 25;
    });
    this.top = (Math.floor(window.innerHeight / 25) - 1) * 25;
  },
  methods: {
    spread(week) {
      this.weeksOnMonth[week] = !this.weeksOnMonth[week];
    },
    logout() {
      this.$store.dispatch('user/logout');
    },
    async commuteLeave() {
      if (
        !confirm(`정말 ${
          this.leaved ? '출근' : '퇴근'
        }하시겠습니까?\n한번만 누르고, 커먼스페이스앱에서 꼭 확인하세요.`)
      ) return;
      this.fetching = true;
      if (await this.$store.dispatch('user/getCurrentIp') !== this.myip.ip) {
        this.fetching = false;
        alert('회사 WIFI가 아닙니다. 연결후 시도하세요.');
        return;
      }
      await this.$store.dispatch('schedule/record', this.leaved ? 'IN' : 'OUT');
      await this.$store.dispatch('user/fetchStatus');
      await this.$store.dispatch('schedule/fetchSchedule');
      this.fetching = false;
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
  .fetching {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(#ffffff, 0.5);
    z-index: 12800;
  }
}
</style>
