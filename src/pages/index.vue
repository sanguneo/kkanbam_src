<template>
  <div :style="{ marginTop: marginTop + 'px' }" class="loginPage">
    <input v-model="account" type="text" placeholder="Account" />
    <input v-model="password" type="password" placeholder="Password" />
    <div class="checkWrapper">
      <span>
        <input
          id="saveLogin"
          v-model="saveLogin"
          type="checkbox"
          name="saveLogin"
        />
        <label for="saveLogin">로그인유지</label>
      </span>
    </div>
    <button @click="login">LOGIN</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      account: null,
      password: null,
      saveLogin: true,
      marginTop: 0,
    };
  },
  computed: {},
  created() {},
  mounted() {
    const setMarginTop = () => {
      this.marginTop = Math.floor(window.innerHeight / 2 / 25) * 25 - 50;
    };
    window.addEventListener('resize', setMarginTop);
    setMarginTop();
  },
  methods: {
    login() {
      this.$store.dispatch('user/login', this.$data);
    },
  },
};
</script>
<style lang="scss">
.loginPage {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  /*height: 100%;*/

  //margin-top: calc(50vh - (30px * 2));
  height: fit-content;
  & > input[type='text'],
  & > input[type='password'],
  & > button {
    box-sizing: border-box;
    padding: 0;
    width: 100%;
    height: 25px;
    border: 0;
    background: transparent;
    text-align: center;
  }
  .checkWrapper {
    height: 25px;
    margin-top: 25px;
    & > span {
      font-size: 12px;
      &:first-child {
        margin-right: 10px;
      }
      & > input {
        -webkit-appearance: none;
        opacity: 0;
        margin: 0;
        & + :before {
          display: inline-block;
          content: ' ';
          background-image: url('../static/img/check.png');
          width: 12px;
          height: 12px;
          background-size: 100%;
          opacity: 0.3;
        }
        &:checked + :before {
          opacity: 1;
        }
      }
    }
  }
}
</style>
