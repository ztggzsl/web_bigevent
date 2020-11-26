// 开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
// 测试环境服务器地址
// 生产环境服务器地址
// 拦截所有ajax请求:get/post/afax
// 处理参数
$.ajaxPrefilter(function (params) {
    // 拼接对应环境的服务器地址
    params.url = baseURL + params.url

    // 接口配置头信息拼接
    if(params.url.indexOf('/my/') !== -1){
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 判断身份认证信息 登陆拦截
    params.complete = function(res){
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if(obj.status == 1 && obj.message == "身份认证失败！"){
            // 清空本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = "/login.html"
        }
    }
    // 总结：
    // $.ajaxPrefilter（）里面的是
    // 所有ajax都要进行配置
    // 大部分ajax都要进行操作的
    // 有规律的进行特有操作的

})
