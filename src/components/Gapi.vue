<template>
  <div
    :class="{ inactive: !googleLoggedIn }"
    @click="() => (googleLoggedIn ? signOutFromGoogle() : authOnGoogle())"
    class="googleButton"
  >
    G
  </div>
</template>

<script>
export default {
  name: 'Gapi',
  data() {
    return { script: null };
  },
  computed: {
    googleLoggedIn() {
      return this.$store.getters['user/googleLoggedIn'];
    },
  },
  mounted() {
    this.loadGoogleApi();
  },
  methods: {
    loadGoogleApi() {
      if (document.querySelector('#gapi') || this.script) return;
      this.script = document.createElement('script');
      this.script.id = 'gapi';
      this.script.src = 'https://apis.google.com/js/client.js';
      this.script.onload = () => {
        window.gapi.load('client', () => {
          window.gapi.client.setApiKey(
            'AIzaSyCNlJzOECWoiyzu6f-PY_luYepNQdX40ew'
          );
          window.gapi.client.load('calendar', 'v3', () => {
            window.gapi.client
              .init({
                apiKey: 'AIzaSyCNlJzOECWoiyzu6f-PY_luYepNQdX40ew',
                clientId:
                  '601988759336-28i92qqdi0916vfo74k8de84apfpnd6e.apps.googleusercontent.com',
                discoveryDocs: [
                  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
                ],
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
              })
              .then(() => {
                this.googleLogin(
                  window.gapi.auth2.getAuthInstance().isSignedIn.get()
                );
                window.gapi.auth2
                  .getAuthInstance()
                  .isSignedIn.listen(this.googleLogin);
              });
          });
        });
      };
      document.body.appendChild(this.script);
    },
    authOnGoogle() {
      window.gapi.auth2.getAuthInstance().signIn();
    },
    signOutFromGoogle() {
      window.gapi.auth2.getAuthInstance().signOut();
    },
    googleLogin(googleLoggedIn) {
      this.$store.commit('user/setGoogleLoggedIn', googleLoggedIn);
      this.$store.dispatch('schedule/fetchGoogleCalender');
    },
  },
};
</script>

<style lang="scss">
.googleButton {
  position: absolute;
  right: 10px;
  &.inactive {
    color: gray;
  }
}
</style>
