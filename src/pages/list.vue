<template> </template>

<script>
export default {
  name: 'List',
  mounted() {
    this.$store.dispatch('schedule/fetchAlbamSchedule');
  },
};
</script>

<style lang="scss"></style>
