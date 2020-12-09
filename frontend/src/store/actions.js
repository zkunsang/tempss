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
    UPDATE_MANY_STORY(_, storyList) {
        return api.story.updateMany(storyList);
    },
    GET_STORY_LIST(_) {
        return api.story.list();
    },
    GET_STORY_INFO(_, storyId) {
        return api.story.info(storyId);
    },
    LIST_AOS_STORY_RESOURCE(_, storyId) {
        return api.resource.list(storyId);
    },
    LIST_AOS_RESOURCE(_) {
        return api.resource.list();
    },
    LIST_DNN_RESOURCE(_) {
        return api.dnnResource.list();
    },
    UPDATE_DNN_RESOURCE(_, resourceList) {
        return api.dnnResource.update(resourceList);
    },
    UPDATE_DNN_RESOURCE_MANY(_, resourceList) {
        return api.dnnResource.updateMany(resourceList);
    },
    LIST_ARSTICKER_RESOURCE(_) {
        return api.arStickerResource.list();
    },
    UPDATE_ARSTICKER_RESOURCE(_, resourceList) {
        return api.arStickerResource.update(resourceList);
    },
    UPDATE_AOS_RESOURCE(_, resourceList) {
        return api.resource.update(resourceList);
    },
    UPDATE_AOS_RESOURCE_MANY(_, resourceList) {
        return api.resource.updateMany(resourceList);
    },
    DELETE_AOS_RESOURCE(_, deleteInfo) {
        return api.resource.delete(deleteInfo);
    },
    LIST_ITEM({ commit }) {
        return api.item.list().then((itemList) => {
            commit('SET_ITEM_DATA_LIST', itemList);
        });
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
    GET_TABLE_VERSION(_, tableInfo) {
        return api.dataTable.get(tableInfo);
    },
    UPDATE_TABLE_VERSION(_, versionInfo) {
        return api.dataTable.update(versionInfo);
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
    LIST_DATA_TABLE(_) {
        return api.dataTable.list();
    },
    GET_VERSION_LIST(_) {
        return api.version.list();
    },
    UPDATE_VERSION(_, item) {
        return api.version.update(item)
    },
    LIST_COUPON(_) {
        return api.coupon.list();
    },
    CREATE_COUPON(_, item) {
        return api.coupon.create(item);
    },
    DELETE_COUPON(_, item) {
        return api.coupon.delete(item);
    },
    UPDATE_COUPON(_, item) {
        return api.coupon.update(item);
    },
    LIST_COUPON_CODE(_, item) {
        return api.couponCode.list(item);
    },
    INSERT_COUPON_CODE(_, item) {
        return api.couponCode.insert(item);
    },

    // UMS
    GET_USER_LIST(_, item) {
        return api.user.list(item);
    },
    GET_USER_INVENTORY(_, userInfo) {
        return api.user.inventory(userInfo);
    },
    USER_EDIT(_, item) {
        return api.user.edit(item);
    },

    LIST_IP(_) {
        return api.ip.list();
    },
    INSERT_IP(_, item) {
        return api.ip.create(item);
    },
    EDIT_IP(_, item) {
        return api.ip.edit(item);
    },
    DELETE_IP(_, item) {
        return api.ip.delete(item);
    },
    GET_SERVER_STATUS(_) {
        return api.serverStatus.list();
    },
    INSERT_SERVER_STATUS(_, serverStatus) {
        return api.serverStatus.create(serverStatus);
    },

    INSERT_PUSH_MESSAGE(_, message) {
        console.log(message);
        return api.pushMessage.create(message);
    }
}

export default actions;