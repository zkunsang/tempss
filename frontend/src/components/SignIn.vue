<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign In</v-toolbar-title>
            <v-spacer />
            <v-tooltip bottom>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="user_id"
                name="login"
                prepend-icon="person"
                type="text"
                v-model="user_id"
              />

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="lock"
                type="password"
                v-model="password"
              />
              <v-text-field
                id="password"
                label="Confirm Password"
                name="password"
                prepend-icon="lock"
                type="password"
                v-model="confirm_password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="onSubmit" :disabled="invalidForm">Submit</v-btn>
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
      'REGIST'
    ]),
    onSubmit() {
      if( this.password != this.confirm_password ) return this.error = "check password!";

      this.REGIST({user_id: this.user_id, password: this.password})
        .then((body_data) => {
          this.$router.push(this.rPath)
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        })
      
    },
  },
  watch: {
    user_id(test) { this.error = ''},
    password(test) { this.error = ''},
    confirm_password(test) { this.error = ''}
  },
  computed: {
    invalidForm() {
      return !this.user_id || !this.password || !this.confirm_password;
    },
    sumbitFail() {
      return !!this.error
    }
  },
  created() {
    this.rPath = this.$route.query.rPath || '/'
  },
  data() {
    return {
      user_id: '',
      password: '',
      rPath: '',
      error: '',
      confirm_password: ''
    }
  }
  ,
};
</script>

<style>
</style>
