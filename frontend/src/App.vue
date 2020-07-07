<template>
  <v-app>
    <v-app-bar app color='red' tile dark clipped-left primary v-if='isQa'>
      <div class='d-flex align-center'>
        <v-img
          alt='Vuetify Logo'
          class='shrink mr-2'
          contain
          src='https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
          transition='scale-transition'
          width='40'
        />주의! QA 서버
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-app-bar app color='red' tile dark clipped-left primary v-else-if="isLive">
      <div class='d-flex align-center'>
        <v-img
          alt='Vuetify Logo'
          class='shrink mr-2'
          contain
          src='https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
          transition='scale-transition'
          width='40'
        />주의! 라이브 서버 CMS
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-app-bar app color='primary' tile dark clipped-left primary v-else>
      <div class='d-flex align-center'>
        <v-img
          alt='Vuetify Logo'
          class='shrink mr-2'
          contain
          src='https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
          transition='scale-transition'
          width='40'
        />개발 서버 CMS
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer app permanent light clipped>
      <v-list-item>
        <v-list-item-content v-if='id'>
          <v-list-item-title class='title'>{{id}} 님!</v-list-item-title>
          <v-list-item-subtitle>안녕하세요</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content v-else>
          <v-list-item-title class='title'>로그인 해주세요</v-list-item-title>
          <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for='item in items' :key='item.title' :to='item.path'>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content fluid>
        <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
// import HelloWorld from './components/HelloWorld';

// prism-qa-cms.day7games.com
import config from '../src/config/config'

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },
  computed: {
    ...mapState({ id: 'id' }),
    isQa() {
      return config.isQa;
    },
    isLive() {
      return config.isLive;
    },
  },

  data: () => ({
    items: [
      { path: '/story', title: '스토리 관리', icon: 'mdi-view-dashboard' },
      { path: '/patchtemp', title: '패치 관리', icon: 'mdi-view-dashboard' },
      { path: '/category', title: '카테고리 관리', icon: 'mdi-view-dashboard' },
      { path: '/product', title: '상품 관리', icon: 'mdi-view-dashboard' },
      { path: '/coupon', title: '쿠폰 관리', icon: 'mdi-view-dashboard' },
    ]
  })
};
</script>