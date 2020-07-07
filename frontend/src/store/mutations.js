import { setAuthInHeader } from '../api'

const mutations = {
    LOGIN(state, { sessionId, id }) {

        console.log('mutations', sessionId, id);
        if (!sessionId) return;

        state.sessionId = sessionId;
        state.id = id;

        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('id', id);
        setAuthInHeader(sessionId);
    },
    LOGOUT(state) {
        state.sessionId = null;
        state.id = null;
        delete localStorage.sessionId;
        delete localStorage.id;
        setAuthInHeader(null);
    },
    SET_THEME(state, color) {
        console.log('SET_THEME', color);
        state.bodyColor = color || '#ffffff';
        state.navbarColor = color ? 'rgba(0,0,0,.15)' : '#026aa7';
    },
}

export default mutations;