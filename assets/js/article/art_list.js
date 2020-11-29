$(function () {
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条
        cate_id: '', //文章分类ID
        state: '' //文章状态 已发布 草稿
    }

    // 初始化文章标签

    var layer = layui.layer
    initTable()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var str = template('tpl-table', res)
                $('tbody').html(str)
                // 分页
                renderPage(res.total)
            }
        })
    }

    // 初始化分类
    var form = layui.form
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 分页
    var laypage = layui.laypage

    function renderPage(total) {
        // alert(total)
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,

            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条数据的选择器
            // 触发jump：分页初始化时，页码改变时
            jump: function (obj, first) {
                // obj：所有参数所在的对象；first：是否是第一次初始化
                console.log(first, obj.curr, obj.limit); //得到当前页
                // 改变当前页
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 判断如果不是第一次初始化分页才能调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        });
    }

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    // 页面汇总删除按钮个数等于1，页码大于1
                    if($('.btn-delete').length == 1 && q.pagenum >1) q.pagenum--
                    // 更新成功后渲染
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})