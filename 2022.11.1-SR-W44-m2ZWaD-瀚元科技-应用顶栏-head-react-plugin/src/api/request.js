import axios from "axios";
import qs from "querystringify";

if (process.env.NODE_ENV === "development") {
  document.cookie =
    // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODczNTQ0NzQzMSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.FjwFGyCC-a2QFua35MxXAcQnA9FV78rb-_pxF2hE9A0";
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY3Mjc5NzcxMDEwMywidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.8nUsA5Ql1ahCmn6_F8q90wcCBJp_xJZgSs2Flys8FSI";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTcxMDg0ODIyNSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.sz9RdnF_5OqSl5jOqZ1mnNYZweVCw6gKyGZ7XltJOOk";
  // "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc3Mjk1NTQxMiwidXNlcklkIjoiYmM0ODJmMjEtYThkYi00YTYxLTg2ODYtOGI4NzUzODYwM2YzIn0.v4Lo2Szftj2HKxf27xhWl2S0UClOHPIMBXJhf09YiBI";
  document.cookie =
    // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODczNTQ0NzU1OH0.0OpXidMdEjG_xUqLxfrxmoTSwazvS11ycY-EuobNIug";
    // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTA4ODU3OTA4MX0.nuXOBnoWBMK11EKqaOr_raUujYK5s_RA4l1_Q6JxuuI";
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2OTcxMDg0ODMzM30.ZEmMza3SCPmltexKFYdy25CC0B8p4peND0PFUxXJoTA";
  // "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2ODc3Mjk1NTYxMX0.zg_F5flGAkEZ0sWg1BSCBcXYW3CSfiVmxfJWZFTCsZk";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  // document.cookie = "JSESSIONID=D2012FF85B626ADD2958913BC2F5CD92";
  // document.cookie = "XSRF-TOKEN=03b34bf1-3ce6-4d14-8894-1a42f0559947";
}

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/sdata/rest`,
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
