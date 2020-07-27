import { setAuthInHeader } from '../api'

const mutations = {
    LOGIN(state, { sessionId, adminId }) {
        if (!sessionId) return;

        state.sessionId = sessionId;
        state.adminId = adminId;

        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('adminId', adminId);
        setAuthInHeader(sessionId);
    },
    LOGOUT(state) {
        state.sessionId = null;
        state.adminId = null;
        delete localStorage.sessionId;
        delete localStorage.adminId;
        setAuthInHeader(null);
    },
    SET_THEME(state, color) {
        console.log('SET_THEME', color);
        state.bodyColor = color || '#ffffff';
        state.navbarColor = color ? 'rgba(0,0,0,.15)' : '#026aa7';
    },
}

export default mutations;