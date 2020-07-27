import * as api from '../api'
import state from './state';

const actions = {
    LOGIN({ commit }, { adminId, password }) {
        return api.auth.login(adminId, password)
            .then(({ sessionId, adminId }) => {
                commit('LOGIN', { sessionId, adminId })
            })
    },
    REGIST(_, { adminId, password, confirmPassword }) {
        return api.auth.regist(adminId, password, confirmPassword);
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