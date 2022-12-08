import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie = "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NTQ1OTM2MDA5OSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.l3fZopgGmfCERwI_7E0YcV7C1PHPlnYipzsy7PMeZ-Y";
  document.cookie = "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2NDQxNzMxMzEyOX0.5HG7bd1_wdBPdUkq7B-faCps5tT_oUtNHcCaMHBIv0E";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  document.cookie = "JSESSIONID=CC5DA4EE66B972CC47339ED82F071CD6";
  document.cookie = "XSRF-TOKEN=6481be24-9547-4f1a-90f0-9aa6cd543b26";
  document.cookie = "lang=zh-cn";
  apiContextPath = "/api";
}

const instance = axios.create({
  baseURL: `${apiContextPath}/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers: (window.location.search && qs.parse(window.location.search).token) || window.token ? { token: qs.parse(window.location.search).token || window.token } : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  (response) => {
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
  (error) => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
