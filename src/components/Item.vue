<template>
  <div :data-week="week" :class="{ spreaded }" class="item">
    <div v-if="weekFirst" class="spread" @click="spread">
      {{ weekIndex }}주차 {{ spreaded ? '접기' : '펼치기' }}
    </div>
    <span class="durationString">
      {{ !sameDate ? `${date}${isToday ? '_today' : ''}` : '\t' }}
    </span>
    <label for="remote" :class="{today: isToday}">
      <input id="remote" v-model="checkedDay" type="checkbox" /><span>재택</span>
    </label>
    <br v-if="!sameDate" />
    <span>{{
      start === '0' || event ? '> ' :`> ${start} ~ ${end}\t`
    }}{{ summary ? summary : '' }}{{ durationString }}</span>
  </div>
</template>

<script>
import moment from 'moment';
import { getStorageKkanbam, setStorageKkanbam } from '@/shared/utils/Storage';

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
      return this.today === this.date;
    },
    checkedDay: {
      get() {
        const remote = this.remote();
        if (!remote || remote.length <= 0) return false;
        return remote.includes(this.date) || false;
      },
      set(checkedDay) {
        const remote = this.remote();
        if (checkedDay) {
          setStorageKkanbam('remote', [...remote, this.date].sort());
        } else {
          setStorageKkanbam('remote', remote.filter((date) => date !== this.date));
        }
      },
    },
  },
  watch: {
    checkedDay() {
      this.$store.dispatch('schedule/fetchSchedule');
    },
  },
  methods: {
    space,
    spread() {
      this.$emit('spread');
    },
    remote() {
      return getStorageKkanbam('remote') || [];
    },
  },
};
</script>

<style lang="scss">
.item {
  &:not(.spreaded) {
    label,
    span,
    br {
      display: none;
    }
  }

  & > span:last-child {
    white-space: pre;
  }

  & > .spread {
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
  label {
    margin-left: -10px;
    &:not(.today) {
      margin-left: 40px;
    }
  }
}
</style>
