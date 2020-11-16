<template>
  <v-app>
    <v-app-bar app v-bind:color="appBarColor" tile dark clipped-left primary>
      <v-col cols=11>
      <div class='d-flex align-center'>
        <v-img
          alt='Vuetify Logo'
          class='shrink mr-2'
          contain
          src='https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
          transition='scale-transition'
          width='40'
        />{{appBarTitle}}
      </div>
      </v-col>
      <v-col cols=1>
        <v-btn
          @click="refreshData"
        >데이터 Refresh</v-btn>
      </v-col>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer app permanent light clipped>
      <v-list-item>
        <v-list-item-content v-if='adminId'>
          <v-list-item-title class='title'>{{adminId}} 님!</v-list-item-title>
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
import { mapActions, mapState } from 'vuex';

function getItemList() {
  const service = process.env.NODE_ENV;
  return service.startsWith("cms") ? getCmsList() : getUmsList();
}

function getCmsList() {
  return [
    { path: '/story', title: '스토리 관리', icon: 'mdi-view-dashboard' },
    { path: '/item', title: '아이템 관리', icon: 'mdi-view-dashboard' },
    { path: '/itemCategory', title: '아이템 카테고리', icon: 'mdi-view-dashboard' },
    { path: '/shop', title: '상품 관리', icon: 'mdi-view-dashboard' },
    { path: '/shopGroup', title: '상품 그룹 관리', icon: 'mdi-view-dashboard' },
    { path: '/dataTable', title: '데이터 테이블', icon: 'mdi-view-dashboard' },
    { path: '/resource', title: '리소스 테이블(aos)', icon: 'mdi-view-dashboard' },
    { path: '/commonResource', title: '공통 리소스', icon: 'mdi-view-dashboard' },
    { path: '/patchtemp', title: '패치 관리', icon: 'mdi-view-dashboard' },
    { path: '/category', title: '카테고리 관리', icon: 'mdi-view-dashboard' },
    { path: '/coupon', title: '쿠폰 관리', icon: 'mdi-view-dashboard' },
  ]
}

function getUmsList() {
  return [
    { path: '/userlist', title: '유저 관리', icon: 'mdi-view-dashboard' },
  ]
}


export default {
  name: 'App',
  created: () => {},
  components: {},
  computed: {
    ...mapState({ 
      adminId: 'adminId',
      appBarColor: 'appBarColor',
      appBarTitle: 'appBarTitle'
    }),
  },
  data: () => ({
    items: getItemList(),
    color: 'blue',
  }),
  methods: {
    ...mapActions([
      'LIST_ITEM'
    ]),

    async refreshData() {
      const itemList = await this.LIST_ITEM();
    }
  }

};
</script>