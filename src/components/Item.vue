<template>
  <div :data-week="week" :class="{ spreaded }" class="item">
    <div v-if="weekFirst" class="spread" @click="spread">
      {{ weekIndex }}주차 {{ spreaded ? '접기' : '펼치기' }}
    </div>
    <span class="durationString">
      {{ !sameDate ? `${date}${isToday ? '_today_' : ''}` : '' }}
    </span>
    <br v-if="!sameDate" />
    <span>{{
      start === '0' || event ? '> ' :`> ${start} ~ ${end}\t`
    }}{{ summary ? summary : '' }}{{ durationString }}</span>
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
    event: { type: Boolean, default: false },
    summary: { type: String, default: null },
    sameDate: { type: Boolean, default: false },
    week: { type: Number, default: 0 },
    weekIndex: { type: Number, default: 1 },
    weekFirst: { type: Boolean, default: false },
    spreaded: { type: Boolean, default: true },
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
    spread() {
      this.$emit('spread');
    },
  },
};
</script>

<style lang="scss">
.item:not(.spreaded) {
  span,
  br {
    display: none;
  }
}
.item > span:last-child {
  white-space: pre;
}
.spread {
  margin-top: 25px;
  font-weight: bolder;
  font-style: italic;
  &:before {
    content: '>>>>';
    display: inline-block;
    margin-right: 10px;
  }
  &:after {
    content: '<<<<';
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
