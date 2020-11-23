import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import router from './router'

import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

Vue.component('calendar', Calendar)
Vue.component('date-picker', DatePicker)

Vue.config.productionTip = false
process.env.LOCATION = location.host;

new Vue({ vuetify, router, store, render: h => h(App) }).$mount('#app');