$(function () {
    initArtCateList()
    // 文章类别展示
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var str = template('tpl-art-cate', res)
                $('tbody').html(str)
            }
        })
    }

    // 显示添加文章分类列表
    var layer = layui.layer
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        })
    })

    var indexAdd = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('恭喜您，文章类别添加成功！')
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        })
        // 获取ID，发送Ajax，渲染到页面
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改，提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('恭喜您，文章类别更新成功！')
                layer.close(indexEdit)
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取Id，进入函数后this指向就变了
        var Id = $(this).attr('data-id')
        // 显示询问框
        layer.confirm('是否确认删除', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 因为更新成功。所以重新渲染数据
                    initArtCateList()
                    layer.msg('恭喜您,文章类别删除成功')
                    layer.close(index)
                }
            })
        });
    })
})