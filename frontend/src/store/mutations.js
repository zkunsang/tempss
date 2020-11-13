import { setAuthInHeader } from '../api'

import ArrayUtil from '../util/ArrayUtil';

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
        state.bodyColor = color || '#ffffff';
        state.navbarColor = color ? 'rgba(0,0,0,.15)' : '#026aa7';
    },
    SET_ITEM_DATA_LIST(state, itemData) {
        const itemCategoryList = itemData.itemCategoryList;
        const itemList = itemData.itemList;
        const itemCategoryMap = ArrayUtil.getMapArrayByKey(itemList, 'itemCategory');
        
        state.ITEM_LIST = itemList;
        state.ITEM_CATEGORY_LIST = itemCategoryList;
        state.ITEM_CATEGORY_MAP = itemCategoryMap;
    }
}

export default mutations;