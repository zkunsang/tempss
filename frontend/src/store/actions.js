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
    LIST_PRODUCT(_) {
        return api.product.list();
    },
    CREATE_PRODUCT(_, item) {
        return api.product.create(item);
    },
    DELETE_PRODUCT(_, item) {
        return api.product.delete(item);
    },
    UPDATE_PRODUCT(_, item) {
        return api.product.update(item);
    },
    UPDATE_MANY_PRODUCT(_, item) {
        return api.product.updateMany(item);
    },
    UPDATE_MANY_PRODUCT_REWARD(_, item) {
        return api.product.updateManyReward(item);
    },
    LIST_GROUP(_, item) {
        return api.productGroup.list(item);
    },
    CREATE_GROUP(_, item) {
        return api.productGroup.create(item);
    },
    UPDATE_GROUP(_, item) {
        return api.productGroup.update(item);
    },
    DELETE_GROUP(_, item) {
        return api.productGroup.delete(item);
    },
    UPDATE_GROUP_MANY(_, item) {
        return api.productGroup.updateMany(item);
    },
}

export default actions;