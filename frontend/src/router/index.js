import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import SignIn from '../components/SignIn.vue'
import StoryList from '../components/StoryList.vue'
import StoryInfo from '../components/StoryInfo.vue'
import AosUpload from '../components/AosUpload.vue'
import ItemList from '../components/ItemList.vue'
import ItemCategory from '../components/ItemCategory.vue'
import Shop from '../components/Shop.vue'
import ShopGroup from '../components/ShopGroup.vue'
import DataTable from '../components/DataTable.vue'

import Home from '../components/Home.vue'

import NotFound from '../components/NotFound.vue'

import store from '../store';

import DatetimePicker from 'vuetify-datetime-picker'
import 'vuetify-datetime-picker/src/stylus/main.styl'
import JsonExcel from 'vue-json-excel';

Vue.use(VueRouter);
Vue.use(DatetimePicker);

Vue.component('downloadExcel', JsonExcel);

const requireAuth = async (to, from, next) => {
    const loginPath = `/login?rPath=${encodeURIComponent(to.path)}`;
    
    const { sessionId, adminId } = localStorage;
    
    await store.commit('LOGIN', { sessionId, adminId } || {});
    
    store.getters.isAuth ? await next() : await next(loginPath);
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home,
            beforeEnter: requireAuth,
            redirect: '/story'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/sign-in',
            component: SignIn
        },
        {
            path: '/aos_upload',
            component: AosUpload,
            beforeEnter: requireAuth
        },
        {
            path: '/story',
            component: StoryList,
            beforeEnter: requireAuth
        },
        {
            path: '/item',
            component: ItemList,
            beforeEnter: requireAuth
        },
        {
            path: '/itemCategory',
            component: ItemCategory,
            beforeEnter: requireAuth
        },
        {
            path: '/shop',
            component: Shop,
            beforeEnter: requireAuth
        },
        {
            path: '/shopGroup',
            component: ShopGroup,
            beforeEnter: requireAuth
        },
        {
            path: '/dataTable',
            component: DataTable,
            beforeEnter: requireAuth
        },
        {
            path: '/patch',
            component: StoryList,
            beforeEnter: requireAuth
        },
        {
            path: '/story-info/:storyId',
            component: StoryInfo,
            beforeEnter: requireAuth,
        },
        {
            path: '*',
            component: NotFound,
            beforeEnter: requireAuth,
        }
    ]
});

export default router;