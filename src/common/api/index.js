import axios from 'axios'
// import { getData } from '../preferences'
import { HOST, ENV } from '../api/constants'
import { API_TIMEOUT } from '../../constants'


export const HOST_URL = HOST[ENV]

export const MULTIPART_HEADER = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}

export const getMyConfig = (isOpenApi) => {
    var config = {}

    config.timeout = API_TIMEOUT
    config.headers = {}

    if (isOpenApi === false) {
        config.headers.token = 'SENDING_TOKEN'
    }
    let device_token = localStorage.getItem('fcmToken')

    if (device_token) {
        config.headers.devicetoken = device_token
    }

    return config
}

const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    platform: 'web'
}

const axiosApi = axios.create({
    baseURL: HOST_URL,
    withCredentials: false,
    headers: defaultHeaders
})

axiosApi.interceptors.request.use(
    async (config) => {
        try {
            let token = window.localStorage.getItem('accessToken');

            if (!config.headers["authorization"]) {
                config.headers["authorization"] = `Token ${token}`;
            }

            if (config.headers["Content-Type"] === "application/json") {
                config.headers["Accept"] = "application/json";
                config.headers["Content-Type"] = "application/json";
            } else if (
                config.headers["Content-Type"]?.startsWith("multipart/form-data")
            ) {
                config.headers["Accept"] = "*";
                config.headers["Content-Type"] = "multipart/form-data";
            }

            // Optional encryption / logging
            // config.data = {
            //   _a: CryptoJS.AES.encrypt().toString()
            // }
            // LOG(LOG_TYPE.INFO, 'AXIOS REQUEST URL', config.url)
            // LOG(LOG_TYPE.INFO, 'AXIOS REQUEST HEADER', JSON.stringify(config.headers))
            // LOG(LOG_TYPE.INFO, 'AXIOS REQUEST DATA', JSON.stringify(config.data))

            return config; // ✅ just return config, no need for resolve()
        } catch (error) {
            return Promise.reject(error); // ❌ reject directly instead of inside new Promise
        }
    },
    (error) => Promise.reject(error),
    {
        synchronous: false,
    }
);


axiosApi.interceptors.response.use(
    response => {
        // LOG(LOG_TYPE.INFO, 'AXIOS RESPONSE STATUS', response.status)
        // LOG(LOG_TYPE.INFO, 'AXIOS RESPONSE DATA', JSON.stringify(response.data))

        return response
    },
    async error => {
        let response = {
            status: error?.response?.status,
            result: false
        }

        // LOG(LOG_TYPE.ERROR, 'API ERROR RESPONSE: ', response)

        return response
    },
    {
        synchronous: false
    }
)

export { axiosApi }
