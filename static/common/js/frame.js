/*** Created by gzy on 2019/6/25.
 *   公共js，
 *   实现的功能包括：
 *   1   窗口中中间线的缩放功能，左拉或右拉
 *   2   页面自适应
 *   3   缩进功能
 *   4
 *
 */

/* 导航栏*/
$(document).ready(function () {
    $("#headerContainer").load("/static/common/html/header.html");
});
/*  页面全局 参数   */
var tableDatas; /* 页面 左侧表格的数据  */
var widewsPercentage = [30, 30];       //存储窗体当前的左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。
var leftMinWidth;//左侧按钮区的最小宽度
var MinPercentage = 0.3;//窗体左右比例的最小值，默认是0.3，打开页面的时候，要初始化
var MaxPercentage = 0.5;//窗体左右比例的最大值，默认是0.5，
var _config = {};            /*配置信息，存储页面上 各id， 以及echarts'数据  */
/*echarts 数据*/
var _dom;
var _echart;
/* 锁 数据区 */
var gb = {
    handler: {          //一个锁
        isDown: false
    },
    showFlag: true, //现在的缩进状态，已true：隐藏  false：已显示
    lock: false       //是否锁死缩放栏,默认是false。但是点击缩进按钮后，缩放栏会锁死，不允许缩放。
}

/*函数*/
var _initTable = null;

/* 页面框架  初始化
*   mapDir ：词实例，对应的 标记，在settings.py中，存储了对应的路径
*   mainContainer ：页面容器id
*   tableContainer ：左侧 容器id
*   operationBtnGroup ：操作按钮 容器id
*   addBtn ：新增按钮 容器id
*   delBtn ：删除按钮 容器id
*   refBtn ：刷新按钮 容器id
*   backgroundSwitch ：背景切换按钮 容器id
*   hideBtn ：缩放按钮 id
*   dataTable : 左侧表格id
*   handler : 分割线的 id
*   echartsContainer : 右侧页面容器 id
*   echartId ： echarts 容器id
*   echartsObjId: echarts实例对象id
*   initEchart: echarts绘制函数
* */

var initFrame = function (
    mapDir,
    mainContainer,
    tableContainer,
    operationBtnGroup,
    addBtn,
    delBtn,
    refBtn,
    backgroundSwitch,
    hideBtn,
    dataTable,
    handler,
    echartsContainer,
    echartId,
    echartsObjId,
    initEchart   //函数：根据表格的一行数据，绘制echarts
) {
    /*记录参数*/
    _config.mapDir = mapDir;
    _config.mainContainer = mainContainer;
    _config.tableContainer = tableContainer;
    _config.operationBtnGroup = operationBtnGroup;
    _config.backgroundSwitch = backgroundSwitch;
    _config.addBtn = addBtn;
    _config.delBtn = delBtn;
    _config.refBtn = refBtn;
    _config.hideBtn = hideBtn;
    _config.dataTable = dataTable;
    _config.handler = handler;
    _config.echartsContainer = echartsContainer;
    _config.echartId = echartId;     //echarts div的id
    _config.echartsObjId = echartsObjId; //echarts实例的id
    _initEchart = initEchart;

    leftMinWidth = $("#" + _config.operationBtnGroup).width()
        + $("#" + _config.hideBtn).width()
        + $("#" + _config.handler).width();//左侧按钮区的最小宽度

    _dom = document.getElementById(echartId);
    /*  缩进/展开功能   */
    $("#" + _config.hideBtn).bind("click", function () {
        var windowW = $(window).width();
        if (!gb.showFlag) { //显示
            gb.lock = false;          //开放 缩放功能
            gb.showFlag = true;
            $("#" + _config.tableContainer).show();
            $(".bootstrap-table").show();
            $("#" + _config.hideBtn + " > img").attr("src", "/static/img/left.png").attr("title", "缩进");
            $("#" + _config.operationBtnGroup + " button").show();
            $("#" + _config.operationBtnGroup + " div").show();
            widewsPercentage[0] = widewsPercentage[1];
        } else {                                             //隐藏
            gb.lock = true;           //关闭缩放功能
            gb.showFlag = false;
            $("#" + _config.hideBtn + " > img").attr("src", "/static/img/right.png").attr("title", "展开");
            $(".bootstrap-table").hide();
            $("#" + _config.operationBtnGroup + " button").hide();
            $("#" + _config.operationBtnGroup + " div").hide();
            $("#" + _config.hideBtn).show();
            widewsPercentage[0] = 100 * 28 / windowW;     //计算一个合适的比例，使缩放按钮可以正常显示
        }
        adjustScrollPage();
    });

    /*缩放功能*/
    /*
    *   h-handler ： 缩放栏id
    *   adjustScrollPage:回调函数
    * */
    $('#' + handler).mousedown(function () {
        gb.handler.isDown = true;
    });
    $(window).mousemove(function (e) {
        if (gb.handler.isDown) {
            var left = e.clientX / window.innerWidth;
            setSplitPosition(left);
        }

    }).mouseup(function () {
        gb.handler.isDown = false;
    });

    //窗体改变时触发
    window.onresize = function () {
        if (gb.lock) {            //这种情况下，要重新计算比例，否则会出现大量空白，影响效果
            widewsPercentage[0] = 100 * 28 / $(window).width();
        }
        calculateMinPercentage();/*重新计算最小比例*/
        setSplitPosition(MinPercentage);//重新设置 左右两侧新的比例
        adjustScrollPage();
    }

    /*新增功能*/
    $("#" + _config.addBtn).bind("click", function () {
        //页面层
        layer.open({
            id: "uploadData",
            type: 1,
            title: "新增数据",
            resize: false,
            shade: 0.5,                 //遮罩层 灰度
            skin: 'layui-layer-rim',    //加上边框
            area: ['580px', '550px'],   //宽  ， 高
            content: '' +
                '<div class="modal-body"> ' +
                '    <input type="file" name="excelFile" id="excelFile" multiple class="file-loading" /> ' +
                '</div> ',
            success: function (layero, index) {
                var control = $('#' + "excelFile");
                $("#excelFile").fileinput({
                    language: 'zh', //设置语言
                    uploadUrl: "/uploadDataByDirAndName/",  //上传的地址
                    showUpload: true,
                    maxFileCount: 1,
                    maxFileSize: 10000,  //单位为kb，如果为0表示不限制文件大小
                    enctype: 'multipart/form-data',
                    allowedFileExtensions: ['xlsx', 'xls'],//接收的文件后缀
                    mainClass: "input-group-lg",
                    uploadExtraData: function () {////传参
                        var data = { //此处自定义传参
                            mapDir: _config.mapDir
                        };
                        return data;
                    }
                }).on("fileuploaded", function (event, data, previewId, index) {
                    //上传结果处理
                    layer.open({  /*  展示处理结果信息  */
                        title: '上传结果',
                        content: data.response.message
                    });
                    if ("true" == data.response.result) { //刷新表格
                        initPageData(_config.url, "正在刷新...");/*刷新左侧表格*/
                    } else if ("false" == data.response.result) {
                        //不操作
                    }
                })
            },
            btn: ['关闭'] //可以无限个按钮
        });

    })

    /*删除功能*/
    $("#" + _config.delBtn).bind("click", function () {
        var selectedData = $('#' + _config.dataTable).bootstrapTable('getSelections');
        if (typeof selectedData === null || selectedData.length == 0) {
            layer.open({
                title: '提示',
                content: '请至少选中一条要删除的数据！'
            });
            return;
        } else {
            layer.confirm('确定删除选中的数据吗？', {//询问框
                btn: ['删除', '取消'] //按钮
            }, function (index) {
                var data = '';
                $.each(selectedData, function (i, item) {
                    data = data + ',' + item.fullFileName;
                });
                data = data.substring(1, data.length);
                var index = layer.load(1); //打开loading
                $.ajax({
                    type: "GET",
                    async: true,
                    url: "/deleteDataByDirAndName",
                    data: {
                        fileNameList: data,
                        mapDir: _config.mapDir
                    },
                    success: function (data) {
                        layer.close(index);  //关闭loading
                        layer.open({ /*展示处理结果*/
                            title: '结果',
                            content: data
                        });
                        layer.msg("正在刷新");
                        initPageData(_config.url, "正在刷新...");/*刷新左侧表格*/
                        layer.close(index); //关闭confir弹出框
                    }

                });

                //layer.msg('的确很重要', {icon: 1});
            }, function (index) {
                layer.close(index);//关闭弹出框
            });
        }
    })

    /*刷新功能*/
    $("#" + _config.refBtn).bind("click", function () {
        layer.msg("正在刷新");
        initPageData(_config.url, "正在刷新...");/*刷新左侧表格*/
    })

    /*背景切换*/
    var form = layui.form;
    form.on('switch(backgroundSwitch)', function (data) { //监听指定开关
        var value= this.checked;
        _echart = echarts.getInstanceById(_config.echartsObjId);
        //_echart.resize();
        if(value){      //切换成黑色
            textColor='#ccc'
            backgroundColor="#404a59"
            emphasisColor='#aaa'
            textEmphasisColor ='#fff'
            //_echart.setTheme("dark");

        }else{          //切换成白色
            textColor='#444444'
            backgroundColor="#C1C1C1"
            emphasisColor='#555555'
            textEmphasisColor = "#000000"
        }
         _echart.setOption({
                backgroundColor: backgroundColor,
                /*timeline:{
                    lineStyle: {        //轴线
                        color: textColor
                    },
                    label: {
                        normal: {
                            textStyle: {
                                fontFamily:"Times New Roman",	//字体
                                color: textColor
                            }
                        },
                        emphasis: {
                            textStyle: {
                                fontFamily:"Times New Roman",	//字体
                                color: textEmphasisColor
                            }
                        }
                    },
                    symbol: 'none',     //timeline标记的图形
                    lineStyle: {        //轴线
                        color: textColor
                    },
                    checkpointStyle: {      //『当前项』（checkpoint）的图形样式
                        color: textColor,
                        borderColor: '#777',
                        borderWidth: 2
                    },
                    controlStyle: { //播放按钮
                        showNextBtn: false,
                        showPrevBtn: false,
                        normal: {
                            color: textColor,
                            borderColor: textColor
                        },
                        emphasis: {
                            color: emphasisColor,
                            borderColor:emphasisColor
                        }
                    }
                }*/
            })
        /*layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
            offset: '6px'
        });*/
        // layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    });

}

//页面自适应
var adjustScrollPage = function () {
    var windowEl = $(window);
    //var windowH = windowEl.height() - 50 - 17; //减去导航栏的那个高度 50px
    var windowH = windowEl.height() - 50; //减去导航栏的那个高度 50px
    $('#' + _config.mainContainer).css('height', windowH);
    $("#" + _config.tableContainer).css("height", windowH);
    $("#" + _config.handler).css("height", windowH);
    $("#" + _config.echartsContainer).css("height", windowH);

    $('#' + _config.tableContainer).css('width', widewsPercentage[0] + '%');
    $('#' + _config.echartsContainer).css('width', (100 - widewsPercentage[0]) + '%')
        .css('left', widewsPercentage[0] + '%');
    $("#" + _config.handler).css('left', widewsPercentage[0] + '%');
    setTimeout(function () {/*中国地图*/
        _dom.style.height = (window.innerHeight - 55) + 'px';
        _echart = echarts.getInstanceById(_config.echartsObjId);
        _echart.resize();
    }, 100);
}
//  set splitter position by percentage, left should be between 0 to 1
//  设置 左右两侧新的比例
var setSplitPosition = function (percentage) {
    if (gb.lock) {
        return;     //锁未开，不允许设置
    }
    percentage = Math.min(0.50, Math.max(0.25, percentage));  // 比例极限区间是 [25,50]
    widewsPercentage = [percentage * 100, percentage * 100];
    adjustScrollPage();
}

/*计算窗体左右比例的最小值*/
var calculateMinPercentage = function () {
    //  比例= 左边按钮区的宽度/整体宽度
    MinPercentage = leftMinWidth / $(window).width();
    MinPercentage = Math.ceil(MinPercentage * 100) / 100;//舍去小数点后两位后面的数据
}


/* 获取页面表格数据
*   url: 数据url
*
*   */
var initPageData = function (url, msg) {
    if (_config.url == undefined) {
        _config.url = url;
    }
    if (msg == undefined) {
        msg = "数据加载中"
    }
    //layer.msg(msg);
    var index = layer.load(1); //打开loading
    $.ajax({
        type: "GET",
        async: false,
        url: _config.url,
        success: function (data) {
            console.log(_config.url + "  扫描成功");
            tableDatas = JSON.parse(data);
            layer.close(index);  //关闭loading
            initTable(tableDatas);
            calculateMinPercentage();//计算窗体左右比例的最小值
            setSplitPosition(MinPercentage);//根据窗体左右比例的最小值，设置窗口比例
            adjustScrollPage(); //页面自适应
            //页面加载完
            $(function () {
                $(".fixed-table-body").css("overflow", "hidden");
                $("#" + _config.dataTable + " > tbody > tr > td").css("cursor", "pointer");
            });
        }
    })
}

/*初始化渲染表格*/
var initTable = function () {
    $('#' + _config.dataTable).bootstrapTable('destroy');//先销毁表格
    $('#' + _config.dataTable).bootstrapTable({
        striped: true,
        cardView: false,
        width: 30,
        striped: false,  //隔行变色  取消掉
        onClickRow: function (row, $element, field) {/*表格的行点击事件*/
            /*选中行，显示特殊样式*/
            $('.info').removeClass('info');//移除class
            $($element).addClass('info');//添加class
            console.log("你点击了行：" + row.fileName);
            selectedRow = row;
            if (typeof (_initEchart) == "function") {
                _initEchart(selectedRow);    //初始化右侧echarts
            }
        },
        columns: [{
            checkbox: true
        }, {
            field: 'fileName',
            title: '<span class="tabldTitle">Data List</span>'
        }],
        data: tableDatas
    });
    /*默认根据第一行数据  绘制 echarts图 */
    if (tableDatas && tableDatas.length > 0) {
        console.log("第一次初始化echart: " + tableDatas[0].fileName);
        selectedRow = tableDatas[0];
        if (typeof (_initEchart) == "function") {
            _initEchart(selectedRow);    //初始化中国地图
        }
    }

}
