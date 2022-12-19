import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MDk5NjYwOTE4NCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.3I6yYqkxjHjWaTMy9Zj02lFJGqLnr6oI5bTDAhlf8FY";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2Njc3NDk2Njc5NCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.saQzbHbyutbG1Qmf3WQfL_rW8rvLYeGVVy0pelxcv_4";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3MDgzMjMwMzkyOH0.rrp4nQQ4hoGkNX7W9y2irSsaJXdBV3-dIWuA78x3Hpw";
  // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2Njc3NDk2Njc5N30.dOgMyzBINdQha3cL6PQppqusZEKcjjI85vpv8xZ6jxc";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  document.cookie = "XSRF-TOKEN=5a6c6d60-6f95-45bb-8d3b-a08a8d0e0ac9";
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
