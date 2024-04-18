import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ERROR_CODES } from './codes'
// import { useUserStoreWithOut } from "@/stores/user";

class Axios {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 10000
    })
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // const userStore = useUserStoreWithOut();
        // const token = userStore.getSimpleToken();
        // console.log("token", token);
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (res) => {
        if (res.data instanceof Blob) {
          // 下载
          return res.data
        }
        if (res.status !== 200) {
          const msg = `接口调用 '${res.status}' 错误`
          ElMessage({
            message: msg,
            type: 'error',
            duration: 5000
          })
          return Promise.reject(new Error(msg))
        }

        const code = res.data.code
        if (code !== 200) {
          const msg = res.data.msg || '接口调用失败'
          if (code === ERROR_CODES.TOKEN_ERROR || code === ERROR_CODES.UNAUTHORIZED) {
            // token 错误
            // const userStore = useUserStoreWithOut();
            // userStore.logout();
            return Promise.reject(new Error(msg))
          } else {
            // 当成正确值, 返回给调用者处理
            ElMessage({
              message: res.data.msg,
              type: 'error',
              duration: 5000
            })
            return res.data
          }
        }
        return res.data
      },
      (error) => {
        console.error(error)
        let message = error.message
        if (message.indexOf('timeout') !== -1) {
          message = '接口调用超时'
        } else {
          message = `接口调用 '${error.response.status}' 错误`
        }
        ElMessage({
          message: message,
          type: 'error',
          duration: 5000
        })
        return Promise.reject(error)
      }
    )
  }

  get(url, params, config) {
    return this.axiosInstance.get(url, { params, ...config })
  }

  post(url, data, config) {
    return this.axiosInstance.post(url, data, config)
  }
}

export const http = new Axios()
