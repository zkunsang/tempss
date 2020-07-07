import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import router from './router'

Vue.config.productionTip = false
process.env.LOCATION = location.host;

new Vue({ vuetify, router, store, render: h => h(App) }).$mount('#app');