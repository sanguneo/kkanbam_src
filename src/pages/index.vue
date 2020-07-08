<template>
  <component :is="isLoggedIn ? 'List' : 'Login'" />
</template>

<script>
import Login from './login';
import List from './list';
export default {
  name: 'Index',
  components: {
    Login,
    List,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['user/isLogin'];
    },
  },
};
</script>
<style lang="scss"></style>
