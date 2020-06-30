<template>
  <div className="listPage">
    <div className="whatWeek">
      <!--      <span onClick={() => scheduleActions.moveWeek('p')}>P </span>-->
      <!--      {moment(scheduleState.thisMonday).format('YYYY-MM-DD')} ~ {moment(scheduleState.thisMonday + 518400000).format('YYYY-MM-DD')}-->
      <!--      <span onClick={() => scheduleActions.moveWeek('n')}> N</span>-->
    </div>
    <div contentEditable suppressContentEditableWarning className="content">
      {{ schedule.length === 0 ? '작성된 일정이 없습니다.' : '' }}
      <br v-if="schedule.length === 0" />
      <Item
        :key="`${roll.start}_${idx}`"
        v-for="(roll, idx) in schedule"
        :date="roll.date"
        :start="roll.start"
        :end="roll.end"
        :durationString="roll.durationString"
        :summary="roll.summary"
        :same-date="idx > 0 ? roll.date === schedule[idx - 1].date : false"
      />
      <br />
      WorkToGo : {{ need | msToTime }}<br />
      Worked : {{ mine | msToTime }}<br />
      Remain : {{ remain }}<br />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  msToTime,
} from '../shared/utils';

export default {
  name: 'List',
  filters: {
    msToTime(value) {
      return msToTime(value);
    },
  },
  computed: {
    schedule() {
      return this.$store.getters['schedule/schedule'];
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
  mounted() {
    this.$store.dispatch('schedule/fetchAlbamSchedule');
  },
};
</script>

<style lang="scss"></style>
