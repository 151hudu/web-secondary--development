# topology-view

le5le topology 预览页.

# 如何使用

## 解压 zip 运行

- 安装依赖包

```
npm install
npm start

// or

yarn
yarn start
```

- 本地运行

```
npm install -g http-server
http-server
```

## 在浏览器中打开

http://localhost:8080
缺省打开 index.html 平级目录下 data.json。

或

http://localhost:8080?id=1  
在 index.html 平级目录下必须存在 1.json。

.json 文件为编辑器中“下载为 JSON 文件”

# 生产环境

用 nginx 静态代理即可，例如：

```
server {
    listen       80;
    server_name  域名.le5le.com;

    #access_log  /var/log/nginx/host.access.log  main;

    root /root/web/静态文件夹名;

    location / {
        index index.html;
        rewrite ^/.*/$ / last;
        rewrite ^([^.]*[^/])$ $1/ permanent;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
