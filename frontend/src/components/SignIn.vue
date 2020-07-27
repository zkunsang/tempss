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
                label="adminId"
                name="login"
                prepend-icon="person"
                type="text"
                v-model="adminId"
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
                v-model="confirmPassword"
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
      if( this.password != this.confirmPassword ) return this.error = "check password!";

      this.REGIST({adminId: this.adminId, password: this.password, confirmPassword: this.confirmPassword})
        .then((bodyData) => {
          this.$router.push(this.rPath)
        })
        .catch((err) => {
          this.error = err;
          console.log(err);
        })
      
    },
  },
  watch: {
    adminId(test) { this.error = ''},
    password(test) { this.error = ''},
    confirmPassword(test) { this.error = ''}
  },
  computed: {
    invalidForm() {
      return !this.adminId || !this.password || !this.confirmPassword;
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
      adminId: '',
      password: '',
      rPath: '',
      error: '',
      confirmPassword: ''
    }
  }
  ,
};
</script>

<style>
</style>
