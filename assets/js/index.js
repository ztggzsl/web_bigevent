$(function () {
    getUserInfo()

    // 退出
    var layer = layui.layer
    $('#btnLogout').on('click',function(){
        layer.confirm('是否确认退出',{icon: 3, title:'提示'},function(index){
            localStorage.removeItem('token')
            location.href = "/login.html"
            layer.close(index)
        })
    })
})
// 获取用户信息
// 其他函数要用,封装到入口函数外
function getUserInfo() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     // 重新登录,因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功,渲染用户头像信息
            renderAvatar(res.data)
        }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 优先使用昵称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 用户头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('str', user.user_pic)
        $('.user-avatar').hide()
    } else {
        // 没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.user-avatar').show().html(text)
    }
}