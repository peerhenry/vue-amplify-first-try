<template lang="pug">
.auth
  template(v-if="!isLoggedIn")
    amplify-authenticator(:authConfig="authConfig")
  template(v-else)
    h1 You are logged in
    amplify-sign-out
  div
    button(@click="checkUser") Check user
</template>

<script>
import { components } from 'aws-amplify-vue'
import { AmplifyEventBus } from 'aws-amplify-vue'

export default {
  components,
  data() {
    return {
      authConfig: {
        signInConfig: {},
        signUpConfig: {
          hiddenDefaults: ['phone_number', 'email'],
        },
      },
      isLoggedIn: false,
    }
  },
  computed: {},
  methods: {
    async checkUser() {
      try {
        const thing = await this.$Amplify.Auth.currentAuthenticatedUser()
        console.log(thing)
      } catch (err) {
        console.log('error getting user', err)
      }
    },
    async updateAuthentication() {
      try {
        await this.$Amplify.Auth.currentAuthenticatedUser()
        this.isLoggedIn = true
      } catch (err) {
        this.isLoggedIn = false
      }
    },
  },
  created() {
    this.updateAuthentication()
    AmplifyEventBus.$on('authState', info => {
      console.log('authState event emitted:', info)
      this.updateAuthentication()
    })
  },
}
</script>

<style scoped lang="stylus">
.auth
  margin-top 20px

button
  margin-top 10px
</style>
