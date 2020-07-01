<template>
  <div class="defaultlayout">
    <Gapi />
    <Nuxt />
  </div>
</template>
<script>
export default {
  name: 'Default',
};
</script>

<style lang="scss">
#__nuxt {
  width: 100%;
  height: 100%;
}
#__layout {
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  height: 100%;
  line-height: 25px;
  display: flex;
  justify-content: center;

  font-size: 14px;
  & > .googleButton {
    position: absolute;
    right: 10px;
    &.inactive {
      color: gray;
    }
  }
  & > .logout {
    position: absolute;
    right: 10px;
    height: fit-content;
  }
  & > .commute {
    position: absolute;
    left: 10px;
    height: fit-content;
  }
  & > .debug {
    position: absolute;
    right: 10px;
    height: fit-content;
    text-align: right;
  }
}
  .defaultlayout {
    width: 100%;
  }
</style>
