<template>
  <div className="item">
    <span className="durationString">
      {{ !sameDate && `${date}${isToday ? '_today_' : ''}` }}
    </span>
    <br/>
    {{
      !isFromCalendar
        ? `> ${start} ~ ${end}${space(2)}`
        : `> ${!isToday ? space(6) : ''}`
    }}
    {{ durationString || summary }}
  </div>
</template>

<script>
import moment from 'moment';
const space = (times) => ' '.repeat(times);
const today = moment().format('YYYY-MM-DD');
export default {
  name: 'Item',
  props: {
    date: { type: String, default: null },
    start: { type: String, default: null },
    end: { type: String, default: null },
    durationString: { type: String, default: null },
    summary: { type: String, default: null },
    sameDate: { type: Boolean, default: false },
  },
  computed: {
    isFromCalendar() {
      return this.end === null || (this.summary && this.summary !== '');
    },
    isToday() {
      return today === this.date;
    },
  },
  methods: {
    space,
  },
};
</script>

<style lang="scss"></style>
