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
  data = Object.assign(data || {}, { sessionId });
  return axios({
    method,
    url: DOMAIN + url,
    data,
  })
    .then((result) => {
      return result.data.data;
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
    console.log(adminId, password)
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
  list() {
    return request('post', '/story/list');
  },
  info(storyId) {
    return request('post', '/story/info', { storyId });
  },

}

export const resource = {
  list(storyId) {
    return request('post', '/resource/list', { storyId });
  },
  update(resoureList) {
    return request('post', '/resource/update', resoureList);
  },
}

export const item = {
  list() {
    return request('post', '/item/list', {});
  },
  delete(item) {
    return request('post', '/item/delete', item);
  },
  create(item) {
    return request('post', '/item/create', item);
  },
  update(item) {
    return request('post', '/item/update', item);
  },
  updateMany(item) {
    return request('post', '/item/updateMany', item);
  },
  updateManyMaterial(item) {
    return request('post', '/item/updateManyMaterial', item);
  }
}

export const product = {
  list() {
    return request('post', '/product/list', {});
  },
  delete(product) {
    return request('post', '/product/delete', product);
  },
  create(product) {
    return request('post', '/product/create', product);
  },
  update(product) {
    return request('post', '/product/update', product);
  },
  updateMany(product) {
    return request('post', '/product/updateMany', product);
  },
  updateManyReward(product) {
    return request('post', '/product/updateManyReward', product);
  }
}

export const productGroup = {
  list() {
    return request('post', '/productGroup/list', {});
  },
  delete(product) {
    return request('post', '/productGroup/delete', product);
  },
  create(product) {
    return request('post', '/productGroup/create', product);
  },
  update(product) {
    return request('post', '/productGroup/update', product);
  },
  updateMany(product) {
    return request('post', '/productGroup/updateMany', product);
  },
}

export const category = {
  list() {
    return request('post', '/category/list', {});
  },
  delete(item) {
    return request('post', '/category/delete', item);
  },
  create(item) {
    return request('post', '/category/create', item);
  },
  update(item) {
    return request('post', '/category/update', item);
  },
  updateMany(item) {
    return request('post', '/category/updateMany', item);
  }
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