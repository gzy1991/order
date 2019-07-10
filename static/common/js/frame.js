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


/* 页面框架  初始化
*   mainContainer ：页面容器id
*   tableContainer ：左侧 容器id
*   operationBtnGroup ：操作按钮 容器id
*   hideBtn ：缩放按钮 id
*   dataTable : 左侧表格id
*   handler : 分割线的 id
*   echartsContainer : 右侧页面容器 id
*   echartId ： echarts 容器id
*
* */

var initFrame = function (
    mainContainer,
    tableContainer,
    operationBtnGroup,
    hideBtn,
    dataTable,
    handler,
    echartsContainer,
    echartId) {
    var _dom = document.getElementById(echartId);
    var _echart = echarts.init(_dom);;

    var widewsPercentage = [30, 30];       //存储窗体当前的左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。
    var leftMinWidth = $("#" + operationBtnGroup).width()
        + $("#" + hideBtn).width()
        + $("#" + handler).width();//左侧按钮区的最小宽度
    var MinPercentage = 0.3;//窗体左右比例的最小值，默认是0.3，打开页面的时候，要初始化
    var MaxPercentage = 0.5;//窗体左右比例的最大值，默认是0.5，
    /* 锁 数据区 */
    var gb = {
        handler: {          //一个锁
            isDown: false
        },
        showFlag: true, //现在的缩进状态，已true：隐藏  false：已显示
        lock: false       //是否锁死缩放栏,默认是false。但是点击缩进按钮后，缩放栏会锁死，不允许缩放。
    }

    /*  缩进/展开功能   */
    $("#" + hideBtn).bind("click", function () {
        var windowW = $(window).width();
        if (!gb.showFlag) { //显示
            gb.lock = false;          //开放 缩放功能
            gb.showFlag = true;
            $("#" + tableContainer).show();
            $("#" + hideBtn + " > img").attr("src", "/static/img/left.png").attr("title", "缩进");
            $("#" + operationBtnGroup + " button").show();
            $("#" + operationBtnGroup + " div").show();
            widewsPercentage[0] = widewsPercentage[1];
        } else {                                             //隐藏
            gb.lock = true;           //关闭缩放功能
            gb.showFlag = false;
            $("#" + hideBtn + " > img").attr("src", "/static/img/right.png").attr("title", "展开");
            $("#" + operationBtnGroup + " button").hide();
            $("#" + operationBtnGroup + " div").hide();
            $("#" + hideBtn).show();
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

    //页面自适应
    var adjustScrollPage = function () {
        var windowEl = $(window);
        var windowH = windowEl.height() - 50 - 17; //减去导航栏的那个高度 50px
        $('#' + mainContainer).css('height', windowH);
        $("#" + tableContainer).css("height", windowH);
        $("#" + handler).css("height", windowH);
        $("#" + echartsContainer).css("height", windowH);

        $('#' + tableContainer).css('width', widewsPercentage[0] + '%');
        $('#' + echartsContainer).css('width', (100 - widewsPercentage[0]) + '%')
            .css('left', widewsPercentage[0] + '%');
        $("#" + handler).css('left', widewsPercentage[0] + '%');

        setTimeout(function () {/*中国地图*/
            _dom.style.height = (window.innerHeight - 55) + 'px';
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


    //窗体改变时触发
    window.onresize = function () {
        if (gb.lock) {            //这种情况下，要重新计算比例，否则会出现大量空白，影响效果
            widewsPercentage[0] = 100 * 28 / $(window).width();
        }
        calculateMinPercentage();/*重新计算最小比例*/
        setSplitPosition(MinPercentage);//重新设置 左右两侧新的比例
        adjustScrollPage();
    }

    /*计算窗体左右比例的最小值*/
    var calculateMinPercentage = function () {
        //  比例= 左边按钮区的宽度/整体宽度
        MinPercentage = leftMinWidth / $(window).width();
        MinPercentage = Math.ceil(MinPercentage * 100) / 100;//舍去小数点后两位后面的数据
    }

    /*新增功能*/

    /*删除功能*/

    /*刷新功能*/


}


