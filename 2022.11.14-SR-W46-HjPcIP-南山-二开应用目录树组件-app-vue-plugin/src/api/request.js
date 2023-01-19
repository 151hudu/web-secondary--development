import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MzkzNTcyNjg0OCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.Nh5UrAAxCufc-Soexq1BbN0kuq7TT88dPgbuMZt5jSI";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MzkzNTcyNjg0OX0.tLN1qPNqD-YRR_xKDDe1P64sF7e3Z_Bol6mc5AJamFs";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  document.cookie = "JSESSIONID=73DA9EC7D70F527DC63253722A546629";
  // document.cookie = "JSESSIONID=2F50BA55790ED2182C00145DF9B8D227;";
  apiContextPath = "/api";
}

const instance = axios.create({
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
