import axios from "axios";
import qs from "querystringify";

// const apiContextPath = "http://192.168.1.240:43214";
let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
    document.cookie =
        "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2Nzk4NDU2MDU5OCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.tuv9sEf4yoVoIYKeRv9zGKrDiYz3izZY_nAJACs_p6I";
    document.cookie =
        "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2Nzk4NDU2MDc1N30.WoldwGmLxa6MUIXrjCy0ADvmO5RQiKvtKilBuQrCcg0";
    document.cookie = "username=admin";
    document.cookie = "windowOnline=true";
    document.cookie = "JSESSIONID=D2012FF85B626ADD2958913BC2F5CD92";
    document.cookie = "XSRF-TOKEN=6daf38f3-43c6-4aa8-82af-c3820e7f74cc";
    apiContextPath = "/api";
}

const instance = axios.create({
    // baseURL: `${process.env.REACT_APP_API}/sdata/rest`,
    baseURL: `${apiContextPath}/sdata/rest`,
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
