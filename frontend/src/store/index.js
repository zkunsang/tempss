import Vuex from 'vuex'
import Vue from 'vue'
import state from './state.js'
import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

Vue.use(Vuex);

const store = new Vuex.Store({ state, getters, mutations, actions });
const { sessionId, id } = localStorage;

store.commit('LOGIN', { sessionId, id } || {});

export default store;