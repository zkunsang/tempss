import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import SignIn from '../components/SignIn.vue'
import StoryList from '../components/StoryList.vue'
import AttendanceInfo from '../components/AttendanceInfo.vue'
import AosUpload from '../components/AosUpload.vue'
import Home from '../components/Home.vue'

import NotFound from '../components/NotFound.vue'

import store from '../store';

import DatetimePicker from 'vuetify-datetime-picker'
import 'vuetify-datetime-picker/src/stylus/main.styl'
import JsonExcel from 'vue-json-excel';

Vue.use(VueRouter);
Vue.use(DatetimePicker);

Vue.component('downloadExcel', JsonExcel);

const requireAuth = (to, from, next) => {
    const loginPath = `/login?rPath=${encodeURIComponent(to.path)}`;
    const { sessionId, id } = localStorage;
    
    store.commit('LOGIN', { sessionId, id } || {});
    console.log(loginPath);
    store.getters.isAuth ? next() : next(loginPath);
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home,
            beforeEnter: requireAuth
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
            path: '/patch',
            component: StoryList,
            beforeEnter: requireAuth
        },
        {
            path: '/titleinfo/:seq_title',
            component: StoryList,
            beforeEnter: requireAuth,
            children: [
                // { path: 'title_info', component: TitleInfo },
                // { path: 'chapter_info', component: ChapterInfo },
                // { path: 'side_chapter_info', component: SideChapterInfo },
                // { path: 'ending_info', component: EndingInfo },
                // { path: 'character_info', component: CharacterInfo },
                // { path: 'factor_info', component: FactorInfo },
                // { path: 'payitem_info', component: PayItemInfo },
                // { path: 'costume_info', component: CostumeInfo },
                // { path: 'choice_info', component: ChoiceInfo },
                // { path: 'chapter_detail', component: ChapterDetailInfo },
                // { path: 'chapter_root', component: ChapterRootInfo }
            ]
        },
        {
            path: '*',
            component: NotFound,
            beforeEnter: requireAuth,
        }
    ]
});

export default router;