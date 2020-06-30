<template>
  <pre>
    {{schedule}}
  </pre>
</template>

<script>
export default {
  name: 'List',
  computed: {
    schedule() {
      return this.$store.getters['schedule/schedule'];
    }
  },
  mounted() {
    this.$store.dispatch('schedule/fetchAlbamSchedule');
  },
};
</script>

<style lang="scss"></style>
