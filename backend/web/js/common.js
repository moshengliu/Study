/**
 * 公用js.
 *
 * @author yzm
 */
const MXHY = {
    network: 1,
    isSend: true, // 是否可以发起请求
    switcheryMap: [],
};


try {
    (function () {


        /**
         * 初始化一些数据.
         */
        this.init = function () {
            //
            // // 弹出消息自动删除处理
            // if ($('.alert.msg').length) {
            //     $('.alert.msg').each(function (i, item) {
            //         setTimeout(function () {
            //             $(item).fadeOut();
            //         }, 2000)
            //     })
            // }
            //
            // // 初始化ichecks
            // this.initIchecks($('.i-checks'));
            //
            // //  初始化日期 年月日
            // this.initDatepicker($('#start_date, #end_date'));
            //
            // // 初始化日期 年月日 时
            // this.initDateTimepicker($('#start_time, #end_time'));
            //
            // // 初始化日期 年月日 时分
            // this.initDateTimeBranchpicker($('#start_time_branch'));
            //
            // // 初始化下拉搜索框
            // this. initChosenSelect($('.chosen-select'));
            //
            // this. initChosenSelect($('.chosen-select1'), 1);
            //
            // // 初始化事件绑定
            // this.initEvent();
            //
            // // 插入删除图片图标
            // this.insDelImgBtn();


        };

        /**
         * 切换Switchery开关函数  switchElement Switchery对象,checkedBool 选中的状态
         *
         */
        this.setSwitchery = function (switchElement, checkedBool) {
            if ((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
                switchElement.setPosition(true);
                switchElement.handleOnchange(true);
            }
        };

        /**
         * 基础链接ajax请求.
         *
         * @param url
         * @param params
         * @param title
         * 临时解决办法 点击否之后强制刷新
         */
        this.ajaxLink = function (url, params, title, cancelCallback) {
            if (url == undefined || url == '') {
                return;
            }

            try {
                params = JSON.parse(params);
            } catch (e) {
                params = {};
            }

            // 是否需要刷新
            var refresh = (params.refresh == undefined || params.refresh === '' || params.refresh == null) ? 1 : 0;

            title = (title == undefined || title == null) ? '' : '您确定要' + title + '吗?';

            params.refresh = refresh;

            MXHY.confirm(title, null, function () {
                MXHY.send(url, params, 'post', function () {
                    MXHY.msg('恭喜您操作成功！', null, function () {
                        if (refresh) {
                            MXHY.refresh();
                        }
                    });
                });
            },cancelCallback);
        };

        /**
         * 初始化事件绑定.
         */
        this.initEvent = function () {
            var self = this;

            // 初始化切换按钮
            var elem = document.querySelectorAll('.js-switch');
            $.each(elem, function (k, item) {

                if ($(item).attr('checked')) {
                    $(item).attr('d-val', 1);
                } else {
                    $(item).attr('d-val', 0);
                }

                var switchery = new Switchery(item, {color: '#1AB394', size: "small"});
                $(item).attr('switch-index', k);
                self.switcheryMap.push(switchery);
            });


            // 切换按钮请求
            $('.switchery').unbind().click(function () {
                var _params = {};

                var obj = $(this).parent().find(':input.ajax-link');
                var url = $(obj).attr('data-url'),
                    title = $(obj).attr('title'),
                    params = $(obj).attr('data-params'),
                    switchIndex = $(obj).attr('switch-index'),
                    dVal = parseInt($(obj).attr('d-val'));

                $.extend(_params, JSON.parse(params), {refresh: ''});

                // 基础链接ajax请求
                self.ajaxLink(url, JSON.stringify(_params), title, function () {
                    self.setSwitchery(self.switcheryMap[switchIndex], dVal);
                });
            });


            // 超链接请求
            $('a.ajax-link').unbind().click(function () {

                var url = $(this).attr('data-url'),
                    title = $(this).attr('title'),
                    params = $(this).attr('data-params');

                // 基础链接ajax请求
                self.ajaxLink(url, params, title);
            });

            ///////////////////////////////////////
            //点击取消按钮返回首页
            $('button.go-back').unbind().click(function () {
              self.goBack();
            });

            ///////////////////////////////////////

            // 左侧活动菜单处理
            $('#side-menu li.active').parents('li').addClass('active');

            // 点击图片x按钮删除图片注意 注意类的命名
            // 点击删除的时候把里面的内容清空
            $('._delete').click(function () {
                // 获取上一个节点然后将里面的所有内容清空
                $(this).prev().html('');
                // 隐藏xx按钮
                $(this).hide();
                // 同时删除隐藏域里面的value值 将value的值设置为''
                $(this).parent().find('input').attr('value', '');
            });

            // 给退出系统绑定事件
            $('.logout').unbind().click(function () {
                var url = $(this).attr('data-url');
                MXHY.confirm('您确认要退出系统么？', null, function () {
                    MXHY.send(url, [], 'POST', function (url) {
                        MXHY.msg('操作成功', null, function () {
                            MXHY.forward(url);
                        })
                    })
                });
            })

            // 删除图片事件
            $('div.img-del').unbind().click(function () {
                var pobj = $(this).parent();

                $(pobj).children('a').attr('href', '');

                $(pobj).find('a > img').remove();

                $(pobj).find(":input[type='hidden']").remove();

                $(this).remove();
            });

            // 重置功能为刷新当前页面
            $(':input[type="reset"].btn-primary').unbind().click(function () {
                MXHY.refresh();
            });

            // 给批量操作绑定事件
            $('a.batch-opt').unbind().click(function () {
                var text = $(this).text(), url = $(this).attr('data-url'), ids = [];

                var checked = $(this).parents('.btn-group').parent().find('table :checked');

                checked.each(function () {
                    ids.push($(this).val());
                });

                if (ids.length <= 0) {
                    MXHY.msg('请选择' + text + '的数据', 'error');
                    return;
                }

                ids = ids.join(',');

                MXHY.confirm('您确定要' + text + '吗?', null, function () {
                    MXHY.send(url, {'ids': ids, 'forceReturn': 1}, 'post', function (res) {
                        if (res.error != 0) {
                            MXHY.msg(res.msg, 'error',function(){
                                MXHY.refresh();
                            });
                            return;
                        }
                        MXHY.refresh();
                    });
                });
            });

            // 导出按钮
            $('a.export').unbind().click(function () {
                var url = $(this).data('url');
                var params = self.serializeAryToJson($(this).parent().children('form').serializeArray());
                var start_time = Date.parse(new Date(params.start_time)) /1000;
                var end_time = Date.parse(new Date(params.end_time)) /1000;
                if(!params.start_time){
                    MXHY.msg('请选择开始时间', 'error');
                    return;
                }
                if(!params.end_time){
                    MXHY.msg('请选择结束时间', 'error');
                    return;
                }
                if(params.end_time < params.start_time){
                    MXHY.msg('开始时间不能大于结束时间', 'error');
                    return;
                }

                if(end_time - start_time >3600*24*30){
                    MXHY.msg('导出时间不能大于一个月', 'error');
                    return;
                }

                delete  params.r; // 不需要r参数

                url += self.toUrlParams(params);

                self.forward(url);
            });
        };

        /**
         * 初始化ichecks.
         *
         * @param obj
         */
        this.initIchecks = function (obj) {
            $(obj).iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        };

        /**
         * 初始化日期.年月日
         *
         * @param obj
         */
        this.initDatepicker = function (obj) {

            var opt = {
                language: 'zh-CN',
                minView: 3,
                format: 'yyyy-mm-dd',
                weekStart: 1,//
                todayBtn: 1, // 展示今天的按钮
                autoclose: 1,// 当选择一个日期之后是否立即关闭此日期时间选择器。
                todayHighlight: 1,
                startView: 2,//日期时间选择器打开之后首先显示的视图。 可接受的值：0:仅展示上午 1:小时 2：天，3：月 4 年
                forceParse: 1,// 当选择器关闭的时候，是否强制解析输入框中的值。也就是说，当用户在输入框中输入了不正确的日期，选择器将会尽量解析输入的值，并将解析后的正确值按照给定的格式format设置到输入框中。
            };

            // 如果不是搜索,则限制最小时间
            if (!$('#start_date').hasClass('no-limit-min')) {
                var newDate = new Date();
                opt.startDate = new Date(newDate.toJSON()); // 最小时间为当天
            }

            $(obj).datetimepicker(opt);
        };

        /**
         * 初始化日期.年月日 小时
         *
         * @param obj
         */
        this.initDateTimepicker = function (obj) {

            var opt = {
                language: 'zh-CN',
                minView: 1,  //0从小时视图开始，选分1	从天视图开始，选小时2	从月视图开始，选天3	从年视图开始，选月4	从十年视图开始，选
                format: 'yyyy-mm-dd hh:ii',
                weekStart: 1,//
                todayBtn: 1, // 展示今天的按钮
                autoclose: 1,// 当选择一个日期之后是否立即关闭此日期时间选择器。
                todayHighlight: 1,
                startView: 2,//日期时间选择器打开之后首先显示的视图。 可接受的值：0:仅展示上午 1:小时 2：天，3：月 4 年
                forceParse: 1,// 当选择器关闭的时候，是否强制解析输入框中的值。也就是说，当用户在输入框中输入了不正确的日期，选择器将会尽量解析输入的值，并将解析后的正确值按照给定的格式format设置到输入框中。
                showMeridian: 0, // This option will enable meridian views for day and hour views.
            };

            // 如果不是搜索,则限制最小时间
            if (!$('#start_time').hasClass('search')){
                var newDate = new Date();
                opt.startDate = new Date(newDate.toJSON()); // 最小时间为当天
            }

            $(obj).datetimepicker(opt).on('changeDate', function (ev) {
                //console.log('sdfsdf');
                //$(obj).each(function (i, item) {
                //
                //    $(item).val(':00');
                //});
                //if (ev.date.valueOf() < date - start - display.valueOf()) {
                //
                //
                //}
            });

        };



        /**
         * 初始化日期.年月日 小时 分钟
         *
         * @param obj
         */
        this.initDateTimeBranchpicker = function (obj) {

            var opt = {
                language: 'zh-CN',
                minView: 0,  //0从小时视图开始，选分1	从天视图开始，选小时2	从月视图开始，选天3	从年视图开始，选月4	从十年视图开始，选
                format: 'yyyy-mm-dd hh:ii',
                weekStart: 1,//
                todayBtn: 1, // 展示今天的按钮
                autoclose: 1,// 当选择一个日期之后是否立即关闭此日期时间选择器。
                todayHighlight: 1,
                startView: 2,//日期时间选择器打开之后首先显示的视图。 可接受的值：0:仅展示上午 1:小时 2：天，3：月 4 年
                forceParse: 1,// 当选择器关闭的时候，是否强制解析输入框中的值。也就是说，当用户在输入框中输入了不正确的日期，选择器将会尽量解析输入的值，并将解析后的正确值按照给定的格式format设置到输入框中。
                showMeridian: 0, // This option will enable meridian views for day and hour views.
            };

            // 如果不是搜索,则限制最小时间
            if (!$('#start_time_branch').hasClass('search')){
                var newDate = new Date();
                opt.startDate = new Date(newDate.toJSON()); // 最小时间为当天
            }

            $(obj).datetimepicker(opt).on('changeDate', function (ev) {
                //console.log('sdfsdf');
                //$(obj).each(function (i, item) {
                //
                //    $(item).val(':00');
                //});
                //if (ev.date.valueOf() < date - start - display.valueOf()) {
                //
                //
                //}
            });

        };



        /**
         * 初始化下拉搜索框
         *
         * @param obj
         */
        this.initChosenSelect = function (obj, type) {
            if (type == 1){
                $(obj).chosen({width: "25%"});
            }else{
                $(obj).chosen({width: "100%"});
            }
        }

        /**
         * 插入删除图片图标
         */
        this.insDelImgBtn = function () {

            if ($('div.img-del').length) {
                $('div.img-del').each(function (i, item) {
                    if (!$(item).children('i').length) {
                        $(item).append('<i class="fa fa-window-close" aria-hidden="true" ></i>');
                    }
                })
            }
        }

        /**
         * 创建删除图片div
         *
         * @param obj
         */
        this.createImgDelDiv = function (obj) {

            // 删除存在的
            $(obj).parent().find('.img-del').remove();

            // 添加
            var imgDel = '<div class="img-del">\
                              <i class="fa fa-window-close" aria-hidden="true" ></i>\
                          </div>';

            $(obj).after(imgDel);

        }

        /**
         * 向服务器发送请求.
         */
        this.send = function (url, params, _method, callback) {

            try {

                if (!this.isSend) {
                    throw '不能重复发起请求';
                }

                this.isSend = false;

                if (params == null || params == '' || params.length <= 0) {
                    params = {};
                }

                // 是否需要刷新
                var refresh = (params.refresh === '' || params.refresh == null) ? 0 : 1;

                // 是否强制返回
                var force_return = (params.forceReturn == '' || params.forceReturn == null) ? 0 : 1;

                $.ajax({
                    url: url,
                    data: params,
                    type: _method,
                    dataType: "json",
                    success: function (data) {

                        MXHY.isSend = true;

                        // 强制返回数据
                        if (force_return) {
                            if (callback != undefined && typeof (callback) == "function") {
                                callback(data);
                            }
                            return;
                        }

                        if (data.error != 0) {
                            MXHY.msg(data.msg, 'error',function(){
                                if (refresh){
                                    MXHY.refresh();
                                }
                            });

                            return;
                        }

                        if (callback != undefined && typeof (callback) == "function") {
                            var content = data.content != undefined ? data.content : '';
                            callback(content,data.msg);
                        }
                    },
                    statusCode: {
                        404: function () {

                            MXHY.isSend = true;

                            console.log('404');
                        }
                    },
                    error: function (msg) {

                        MXHY.isSend = true;

                        console.error(msg);
                    }
                });

            } catch (e) {
                console.log(e);
            }
        };

        /**
         * 消息.
         *
         * @param message
         * @param callback
         * @param type: "warning", success info error
         *
         * @author yzm
         */
        this.msg = function (message, type, callback) {


            if (type == null || type == '') {
                type = 'success';
            }

            swal({
                title: "",
                text: message,
                type: type,
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(function () {
                if (callback != undefined && typeof (callback) == "function") {
                    callback();
                }
            }, 2000);
        };

        /**
         * 输入框.
         *
         * @param message
         * @param title
         * @param callback
         * @param placeholder
         *
         * @author yzm
         */
        this.prompt = function (message, title, callback, placeholder) {


            if (title == null || title == '') {
                title = '';
            }
            if (placeholder == null || placeholder == '') {
                placeholder = '';
            }

            swal({
                    title: title,
                    text: message,
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    closeOnCancel: true,
                    animation: "slide-from-top",
                    inputPlaceholder: placeholder
                },
                function (inputValue) {
                    if (inputValue === false) return false;

                    if (inputValue === "") {
                        swal.showInputError("内容不能为空!");
                        return false
                    }

                    if (callback != undefined && typeof (callback) == "function") {
                        callback(inputValue);
                    }

                    swal.close();
                });
        };

        /**
         * 弹窗
         *
         * @param message
         * @param title
         * @param callback
         * @param type: "warning", success info error
         *
         * @author yzm
         */
        this.alert = function (message, title, callback, type) {

            if (title == null || title == '') {
                title = '';
            }

            if (type == null || type == '') {
                type = 'success';
            }

            swal({
                title: title,
                text: message,
                type: type
            }, function () {
                if (callback != undefined && typeof (callback) == "function") {
                    callback();
                }
            });

        };


        /**
         * 确认框
         *
         * @param message
         * @param title
         * @param callback
         * @param cancel_callback
         *
         * @author yzm
         */
        this.confirm = function (message, title, callback, cancel_callback) {

            if (message == null || message == '') {
                message = '您确定要这样做吗?';
            }
            if (title == null || title == '') {
                title = '';
            }

            swal({
                    title: title,
                    text: message,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        if (callback != undefined && typeof (callback) == "function") {
                            callback();
                        }
                    } else {
                        if (cancel_callback != undefined && typeof (cancel_callback) == "function") {
                            cancel_callback();
                        }
                    }
                });
        };

        /**
         * 返回上页并刷新.
         *
         * @author yzm
         *
         * @returns {*}
         */
        this.goBack = function () {
            setTimeout(function () {
                location.replace(document.referrer);
            }, 100);
        };

        /**
         * 刷新页面.
         *
         * @author yzm
         *
         * @param is_parent 是否是刷新父界面 true:是 false：否
         */
        this.refresh = function (is_parent) {

            if (is_parent) {
                window.parent.location.reload();
            } else {
                location.replace(window.location.href);
            }
        };


        /**
         * 页面跳转.
         *
         * @author yzm
         *
         * @returns {*}
         */
        this.forward = function (url, _target) { //
            _target = _target != undefined && _target != '' ? _target : '_self';
            window.open(url, _target);
        };

        /**
         * 设置 sessionStorage.
         *
         * @param key
         * @param value
         * @author yzm
         *
         * @returns {*}
         */
        this.setSessionStorage = function (key, value) {
            if (value === undefined) {
                return;
            }
            if (value === null) { // 移出值
                sessionStorage.removeItem(key);
            } else {
                sessionStorage.setItem(key, value);
            }
        };

        /**
         * 得到 sessionStorage 处理.
         *
         * @param key
         * @author yzm
         *
         * @returns {*}
         */
        this.getSessionStorage = function (key) { //
            var data = sessionStorage.getItem(key);
            try {
                data = JSON.parse(data);
            } catch (e) {
                // console.log('不是一个正常的JSON格式');
            }
            return data;
        };

        /**
         * 获取url中的get参数值.
         *
         * @param name
         * @author yzm
         *
         * @returns {*}
         */
        this.getUrlVar = function (name) {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars[name];
        };

        /**
         * 对回车绑定事件.
         *
         * @param callback 回调函数
         * @param obj 绑定的对象
         *
         * @author yzm
         */
        this.bindEnterEvent = function (obj, callback) {
            obj = obj == undefined ? document : obj;
            $(obj).unbind().on('keyup', function (e) {
                var ev = document.all ? window.event : e;
                // 回车事件
                if (ev.keyCode == 13) {

                    if (callback != undefined && typeof (callback) == "function") {
                        callback($(obj));
                    }
                }
            });
        };

        /**
         * 动态加载js.
         *
         * @param js
         *
         * @author yzm
         */
        this.requireJs = function (js) {
            if (js == '' || js == undefined) {
                return;
            }
            var hm = document.createElement("script");
            hm.src = js;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        };

        /**
         * 验证是否为一个合法的手机号.
         *
         * @param mobile
         *
         * @author yzm
         *
         * @returns {boolean} true|false
         */
        this.isMobile = function (mobile) {
            return /^(13[0-9]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|5|6|7|8|9]|147|177)\d{8}$/.test(mobile);
        };

        /**
         * 表单的序列化数组转换为json.
         *
         * @param Arr
         * @returns {{}}
         */



        this.serializeAryToJson = function (Arr) {
            var data = {};
            $(Arr).each(function () {
                //相同的数组的键会覆盖
                if (data[this.name] !== undefined) {
                    if (!data[this.name].push) {
                        data[this.name] = [data[this.name]];
                    }
                    data[this.name].push(this.value || '');
                } else {
                    data[this.name] = this.value || '';
                }
            });
            return data;
        };

        /**
         * 异部提交表单.
         *
         * @param form_obj
         * @param options
         * @param callback
         */
        this.ajaxForm = function (form, callback) {
            var params = this.serializeAryToJson($(form).serializeArray()),
                url = $(form).attr('action'),
                type = $(form).attr('method');

            this.send(url, params, type, function (url,msg) {
                if(callback!=null&&callback!=undefined){
                    callback(url,msg);
                    return;
                }
                MXHY.msg('操作成功', null, function () {
                    if (url != '') {
                        MXHY.forward(url);
                    } else {
                        MXHY.refresh();
                    }
                });
            });

            return false;
        };

        /**
         * 打开对话框.
         *
         * @param obj
         * @param id
         * @param callback
         */
        this.dialog = function (obj, id, callback, initCallback) {

            var cOjb = $('.' + id),
                btn = true,
                url = $(obj).attr('data-url'),
                title = $(obj).attr('data-title'),
                content = cOjb.html(),
                _w = cOjb.attr('data-w'),
                _h = cOjb.attr('data-h'),
                _btn = cOjb.attr('data-btn'),
                _style = '';

            if (_w != undefined && _w && _w != 0) {
                _style += 'width:' + _w + ';';
            }
            if (_h != undefined && _h && _h != 0) {
                _style += 'height:' + _h + ';';
            }
            if (_btn != undefined && _btn == false) {
                btn = false;
            }

            // 移出已经存在的
            $('#' + id).remove();

            if (title == '' || title == undefined) {
                title = '提示对话框';
            }

            var _htmlHead = '<div class="modal-header">\
                                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                 <h4 class="modal-title" id="exampleModalLabel">' + title + '</h4>\
                            </div>\
                           <div class="modal-body">';

            var _htmlFoot = '</div>\
                             <div class="modal-footer">\
                                <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>\
                                <button type="button" class="btn btn-primary confirm">确认</button>\
                             </div>';

            var html = '<div class="modal fade " id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">\
                            <div class="modal-dialog" role="document"  style="' + _style + '">\
                                <div class="modal-content">\
                                </div>\
                            </div>\
                        </div>';

            $('body').append(html);

            _htmlFoot = !btn ? '' : _htmlFoot;

            // show 方法调用之后立即触发该事件
            $('#' + id).on('show.bs.modal', function (event) {
                var obj = $(event.relatedTarget) // Button that triggered the modal

                var url = $(obj).attr('href');
                if (url == undefined || url == '' || url.indexOf('javascript') != -1) {
                    var modal = $(this);
                    modal.find('.modal-content').html(_htmlHead + content + _htmlFoot);
                }

                // 初始化ichecks
                MXHY.initIchecks($(modal).find('.i-checks'));


                // 初始化日期
                $(modal).find('.date-time').css('z-index', 99999);
                MXHY.initDatepicker($(modal).find('.date-time'));

                if (initCallback != undefined && typeof (initCallback) == "function") {
                    initCallback(obj, modal);
                }
            });

            // 此事件在模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发
            $('#' + id).on('shown.bs.modal', function (event) {
                var modal = $(this);
                var obj = $(event.relatedTarget) // Button that triggered the modal

                $(this).find('.confirm').unbind().click(function(){
                    if (callback != undefined && typeof (callback) == "function") {
                        callback(obj, modal);
                    }
                });
            });

            // hide 方法调用之后立即触发该事件。
            $('#' + id).on('hide.bs.modal', function (event) {
            });

            // 此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发。
            $('#' + id).on('hidden.bs.modal', function (event) {
                $(this).remove();
            });

            // 从远端的数据源加载完数据之后触发该事件
            $('#' + id).on('loaded.bs.modal', function (event) {
                var obj = $(this).find('.modal-content'),
                    content = $(obj).html();

                var modal = $(this);

                // 清空现有的
                $(obj).empty();

                try {

                    // 出错了
                    if (content.indexOf('error') !== -1) {
                        var data = JSON.parse(content);
                        throw data.msg;
                    }

                    // 从新组装数据
                    $(obj).html(_htmlHead + content + _htmlFoot);

                    // 初始化ichecks
                    MXHY.initIchecks($(modal).find('.i-checks'));

                    // 初始化日期
                    MXHY.initDatepicker($(modal).find('#start_time'));

                    $(this).find('.confirm').unbind().click(function () {
                        if (callback != undefined && typeof (callback) == "function") {
                            callback(obj, modal);
                        }
                    });

                } catch (e){
                    MXHY.alert(e, null, function () {
                        MXHY.closeDialog(modal);
                    }, 'warning');
                }
            });

        };

        /**
         * 关闭对话框.
         *
         * @param modalObj
         */
        this.closeDialog = function (modalObj) {
            $(modalObj).modal('hide');
        };

        /**
         * 打开对话框.
         *
         * @param initCallback 初始化数据回掉
         * @param callback 确认回掉
         *
         */
        this.openDialog = function (initCallback, callback, obj) {

            if (obj == undefined || obj == '') {
                obj = $('.dialog[data-target]');
            }

            $(obj).unbind().click(function () {

                var _targetObj = $(this).attr('data-target');
                if (_targetObj == undefined || _targetObj == null) {
                    return;
                }

                var _targetId = _targetObj.replace('#', '');

                // 初始化一个对话框.
                MXHY.dialog($(this), _targetId, callback, initCallback);
            });
        };

        /**
         * 时间戳转换为日期.
         *
         * @param timestamp
         * @returns {*}
         */
        this.time2date = function (timestamp) {
            var date = new Date(timestamp * 1000);
            var Y, M, D, h, m, s;
            Y = date.getFullYear() + '-';
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes();
            return Y + M + D + h + m;
        };

        /**
         * 图表.
         *
         * @param obj
         * @param opt
         */
        this.hchart = function (id, opts) {

            var options = {};

            // 公共配置
            var common = {
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                credits: {
                    enabled: false // 禁用版权信息
                },
                tooltip: {
                    enabled: true,
                },
                legend: {
                    enabled:false,
                },
            };

            // 合并参数
            $.extend(options, common, opts);

            try {
                Highcharts.chart(id, options);
            } catch (e) {
                console.error('对像不存在');
            }
        };

        /**
         * 对象转换为url参数形式.
         *
         * @param params
         * @returns {string}
         */
        this.toUrlParams = function (params) {

            var rst = "";

            try {
                $.each(params, function (name, val) {
                    rst += '&' + name + '=' + val;
                });

            } catch (e) {

            }

            return rst;
        }

    }).apply(MXHY);
} catch (e) {
    console.log('对象被覆盖，请程序员仔细检查！错误信息:' + e);
}


/*MXHY.msg('恭喜您操作成功 ', function () {
 alert(    'sdf')
 })*/


//MXHY.alert('恭喜您操作成功 ',null, function () {
//alert(    'sdf')
//})

//MXHY.confirm('您确定要删除么？',null,function(){
//    alert(1);
//},function(){
//    alert(0);
//})

//
//MXHY.prompt('您确定要删除么？','提示',function(val){
//    alert(val);
//},'请输入您的名字')
//

MXHY.init();

