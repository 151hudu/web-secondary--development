import axios from "axios";
import qs from "querystringify";

// const apiContextPath = "http://192.168.1.240:43214";
let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
    document.cookie =
        "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3NjUzNTg0NDcwNCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.xoU_HM-hvlI_9uCfq5UqKfE9RQAAoa3Kux7M_wGnEBs";
    document.cookie =
        "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTI5NzkzNDEwM30.D5vszpoZh5yv7mWSXelr8IhP93jPZpIBqDvM5NxRvag";
    document.cookie = "username=admin";
    document.cookie = "windowOnline=true";
    apiContextPath = "/api";
}
let a = '/dtyq/pngf/'
const prefix = window.apiContextPathPrefix ? (window.apiContextPathPrefix + "/") : ""

const instance = axios.create({
    baseURL: `${apiContextPath}/dtyq/pngf/sdata/rest`,
    timeout: 60000,
    validateStatus: function (status) {
        return status >= 200 && status < 300; // default
    },
    headers:
        (window.location.search && qs.parse(window.location.search).token) ||
            window.token
            ? { token: qs.parse(window.location.search).token || window.token }
            : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
    response => {
        let { data } = response;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        if (data && data.status !== 200 && !(data instanceof Blob)) {
            return Promise.reject(response);
        }
        if (data instanceof Blob) {
            response.data = data;
            return response;
        }

        response.data = data && data.result;
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            return;
        }

        return Promise.reject(error.response);
    }
);

export default instance;
