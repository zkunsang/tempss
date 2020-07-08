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

    CREATE_STORY(_, story) {
        return api.story.create(story);
    },
    UPDATE_STORY(_, story) {
        return api.story.update(story);
    },
    GET_STORY_LIST(_) {
        return api.story.storyList();
    },
    GET_STORY_INFO(_, storyId) {
        return api.story.storyInfo(storyId);
    },
    GET_AOS_RESOURCE(_, storyId) {
        return api.story.resourceList(storyId);
    },
    UPDATE_AOS_RESOURCE(_, resourceList) {
        return api.story.resourceUpdate(resourceList);
    }
}

export default actions;