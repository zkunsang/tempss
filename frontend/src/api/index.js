import axios from 'axios'
import router from '../router'
import store from '../store'
import config from '../config/config'

const UNAUTHORIZED = 401;
const onUnauthorized = () => {
  console.log("onUnauthorized");
  store.commit('LOGOUT')
  router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`);
}
const DOMAIN = config.getBackendUrl;

console.log(DOMAIN);

const request = (method, url, data) => {

  return axios({
    method,
    url: DOMAIN + url,
    data,
  })
    .then((result) => {
      console.log(result);

      return result.data;
    })
    .catch(result => {
      console.log(result);
      let status = result.response.status;
      const { err_message, err_code } = result.response.data
      if (status === UNAUTHORIZED) {
        onUnauthorized()
      }
      throw err_message
    })
}

export const setAuthInHeader = session_id => {
  axios.defaults.headers.common['Authorization'] = session_id ? `Bearer ${session_id}` : null;
}

export const auth = {
  login(id, passwd) {
    return request('post', '/auth/login', { id, passwd })
  },
  regist(id, passwd) {
    return request('post', '/auth/regist', { id, passwd })
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