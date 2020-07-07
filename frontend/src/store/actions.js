import * as api from '../api'
import state from './state';

const actions = {
    LOGIN({ commit }, { userId, password }) {
        return api.auth.login(userId, password)
            .then(({ sessionId, id }) => {
                commit('LOGIN', { sessionId, id })
            })
    },
    REGIST(_, { userId, password }) {
        return api.auth.signIn(userId, password);
    },
}

export default actions;