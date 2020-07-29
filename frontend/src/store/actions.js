import * as api from '../api'
import state from './state';

const actions = {
    LOGIN({ commit }, { adminId, password }) {
        return api.auth.login(adminId, password)
            .then(({ sessionId, adminId }) => {
                commit('LOGIN', { sessionId, adminId });
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
        return api.story.list();
    },
    GET_STORY_INFO(_, storyId) {
        return api.story.info(storyId);
    },
    GET_AOS_RESOURCE(_, storyId) {
        return api.resource.list(storyId);
    },
    UPDATE_AOS_RESOURCE(_, resourceList) {
        return api.resource.update(resourceList);
    },
    LIST_ITEM(_) {
        return api.item.list();
    },
    DELETE_ITEM(_, item) {
        return api.item.delete(item);
    },
    CREATE_ITEM(_, item) {
        return api.item.create(item);
    },
    UPDATE_ITEM(_, item) {
        return api.item.update(item);
    },
    UPDATE_MANY_ITEM(_, item) {
        return api.item.updateMany(item);
    },
    UPDATE_MANY_ITEM_MATERIAL(_, item) {
        return api.item.updateManyMaterial(item);
    },
    LIST_CATEGORY(_, item) {
        return api.category.list(item);
    },
    CREATE_CATEGORY(_, item) {
        return api.category.create(item);
    },
    UPDATE_CATEGORY(_, item) {
        return api.category.update(item);
    },
    UPDATE_MANY_CATEGORY(_, item) {
        return api.category.updateMany(item);
    },
    DELETE_CATEGORY(_, item) {
        return api.category.delete(item);
    },
}

export default actions;