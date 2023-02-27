import App from "./App.vue";
import {
    sysVariables,
    appVariables,
    customConfig,
    themeInfo
}

    from "@/components/mockData.js";
import './index.css'

function loadScript(url) {
    var script = document.createElement("script")
    script.type = "text/javascript";

    return new Promise((resolve) => {
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    resolve()
                }
            };
        } else { //Others
            script.onload = function () {
                resolve()
            };
        }
        script.src = url;
        document.head.appendChild(script);
    })

}

// 动态记载样式
function loadStyle(url) {
    var style = document.createElement("link");
    style.href = url;
    style.type = "text/css"
    style.rel = "stylesheet"

    document.head.appendChild(style);
}

if (process.env.NODE_ENV !== "production") {
    window.eventCenter = {
        triggerEvent(componentId, eventName) {
            console.log(`${eventName} is triggered`);
        },
    }
    new Vue({
        render: h => {
            return <App
                customConfig={customConfig}
                themeInfo={themeInfo}
                sysVariables={sysVariables}
                appVariables={appVariables}
            />;
        },
    }).$mount("#app");
} else {
    if (!window.CUSTOM_PLUGIN) {
        window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(
        process.env.VUE_APP_CUSTOM_PLUGIN_ID,
        (dom, props) => {
            if (!window.VueRef) {
                window.VueRef = loadScript('/static/vue.min.js').then(() => {
                    return loadScript('/static/element-ui/index.js')
                })
                loadStyle('/static/element-ui/theme-chalk/index.min.css')
            }
            window.VueRef.then(() => {
                run(dom, props)
            })
        }
    );
}

function run(dom, props) {
    if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
    }
    const div = document.createElement("div");
    dom.appendChild(div);
    new Vue({
        render: h => <App {...{ props }} />,
    }).$mount(div);
}
