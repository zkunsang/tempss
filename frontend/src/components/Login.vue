<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer />
            <v-tooltip bottom>
              
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Login"
                name="login"
                prepend-icon="person"
                type="text"
                v-model="userId"
              />

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="lock"
                type="password"
                v-model="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="onSignin">Sign in</v-btn>
            <v-btn color="primary" @click="onLogin" :disabled="invalidForm">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-alert id="submit_fail" v-if="sumbitFail" type="error">{{error}}</v-alert>
      </v-col>
    </v-row>
    <v-layout
      text-center
      wrap
    >
    </v-layout>
  </v-container>
</template>

<script>
import {auth, setAuthInHeader} from '../api'
import {mapActions} from 'vuex'

export default {
  name: 'HelloWorld',
  methods: {
    ...mapActions([
      'LOGIN'
    ]),
    onLogin() {
      this.LOGIN({userId: this.userId, password: this.password})
        .then((body_data) => {
          this.$router.push('story')
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        })
      
    },
    onSignin() {
      this.$router.push('sign-in');
    }
  },
  computed: {
    invalidForm() {
      return !this.userId || !this.password;
    },
    sumbitFail() {
      return !!this.error;
    }
  },
  created() {
    this.rPath = this.$route.query.rPath || '/'
  },
  data() {
    return {
      userId: '',
      password: '',
      rPath: '',
      error: ''
    }
  }
  ,
};
</script>

<style>
.error {
  color: #f00;
}
</style>
