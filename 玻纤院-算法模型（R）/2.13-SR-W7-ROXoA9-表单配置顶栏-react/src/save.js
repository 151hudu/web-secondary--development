/**
 * 
 * 编辑表单加载完成时  为update函数
 */

function update(formData) {
    try {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/sdata/rest/form/data/v2/update`)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.send(JSON.stringify(formData))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText))
                console.log('--------成功');
            }
        }
    } catch (error) {
        console.log(error);
    }
}
/**
 * 新增表单加载完成时 为inster函数 
 * 
*/

function inster(formData) {
    if (window._stepVar === null || window._stepVar === undefined) {

        window._stepVar = 0
    } else {
        window._stepVar++
    }
    try {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/sdata/rest/form/data/v2/${window._stepVar ? 'update' : 'insert'}`)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        if (window._update_devep) formData.pkValue = window._update_devep
        xhr.send(JSON.stringify(formData))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText))
                if (JSON.parse(xhr.responseText || '{}')?.result) window._update_devep = JSON.parse(xhr.responseText || '{}')?.result
                console.log('--------成功');
            }
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * 定时保存方法  编辑页
 * @param formId 表单id 从配置页 的url 获取
 * @param time 保存间隔时间 单位时间时 分
 * @param update 回调请求方法  
 */
function saveFn(formId, time, update) {
    let left = window.location.href
    let timeOnly
        = setInterval(() => { //_save_secondary_development 可以更换变量名
            window.componentCenter.get(formId).getFormSubmitData().then(res => {
                update(res)
            })
            if (window.location.href != left) {
                console.log('------路由变化',);
                clearInterval(timeOnly)
                timeOnly = null
                delete window._stepVar
                delete window._update_devep
            }

        }, time * 1000 * 60)

}
saveFn(formId, time, update)



















