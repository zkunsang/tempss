import axios from 'axios'
import router from '../router'
import store from '../store'
import config from '../config/config'

const UNAUTHORIZED = 401;
const onUnauthorized = () => {
  store.commit('LOGOUT')
  router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`);
}
const DOMAIN = config.getBackendUrl;

const request = (method, url, data) => {
  const { sessionId } = localStorage;
  data = Object.assign(data || {}, {sessionId});
  return axios({
    method,
    url: DOMAIN + url,
    data,
  })
    .then((result) => {
      return result.data;
    })
    .catch(result => {
      let status = result.response.status;
      const { err_message, err_code } = result.response.data
      if (status === UNAUTHORIZED) {
        onUnauthorized()
      }
      throw err_message
    })
}

export const setAuthInHeader = sessionId => {
  axios.defaults.headers.common['sessionId'] = sessionId ? `${sessionId}` : null;
}

export const auth = {
  login(adminId, password) {
    return request('post', '/auth/login', { adminId, password })
  },
  regist(adminId, password, confirmPassword) {
    return request('post', '/auth/regist', { adminId, password, confirmPassword })
  }
}

export const story = {
  create(story) {
    return request('post', '/story/create', story);
  },
  update(story) {
    return request('post', '/story/update', story);
  },
  storyList() {
    return request('post', '/story/list');
  },
  storyInfo(storyId) {
    return request('post', '/story/info', { storyId });
  },
  resourceList(storyId) {
    return request('post', '/story/resourcelist', { storyId });
  },
  resourceUpdate(resoureList) {
    return request('post', '/story/resourceupdate', resoureList);
  },
}

export const banner = {
  fetch_banner_list(user_id) {
    return request('post', '/get_banner_list', { user_id })
  },
  update_banner(user_id, banner_info) {
    return request('post', '/update_banner', { user_id, banner_info })
  },
  insert_banner(user_id, banner_info) {
    return request('post', '/insert_banner', { user_id, banner_info })
  },
}