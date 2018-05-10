/**
 * Created by gzy on 2018/5/11.
 */

/*
公有js
1 窗口中中间线的缩放，左拉或右拉
2 页面自适应
3 上传组件

*/



var widewsPercentage=[40,40];       //窗体左右比例    初始化,左边是 40%  。记录两个40，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例


/*数据区*/
var gb = {
    handler: {          //一个锁
        isDown: false
    },
    lock:false       //是否锁死缩放栏,默认是false。但是点击缩进按钮后，缩放栏会锁死，不允许缩放。
}


// 缩放功能
var initEventHandler = function(){
    // reset typing state
    var typingHandler = null;
    $('#h-handler').mousedown(function() {
        gb.handler.isDown = true;
    });
    $(window).mousemove(function(e) {
        if (gb.handler.isDown) {
            var left = e.clientX / window.innerWidth;
            setSplitPosition(left);
        }

    }).mouseup(function() {
        gb.handler.isDown = false;
    });
}

//  set splitter position by percentage, left should be between 0 to 1
//设置 左右两侧新的比例
var setSplitPosition = function(percentage){
    if(gb.lock){
        return;     //锁未开，不允许设置
    }
    percentage = Math.min(0.50, Math.max(0.25, percentage));  // 比例极限区间是 [25,50]
    widewsPercentage =[ percentage * 100, percentage * 100];
    adjustScrollPage();
}

//窗体改变时触发
window.onresize = function(){
    if(gb.lock){            //这种情况下，要重新计算比例，否则会出现大量空白，影响效果
        widewsPercentage[0]=100*28/$(window).width();
    }
	adjustScrollPage();
}

//页面自适应
var adjustScrollPage = function() {
	var windowEl = $(window);
	var windowH = windowEl.height()-50-17; //减去导航栏的那个高度 50px
    //var windowW = windowEl.width();
    $('#main-container').css('height', windowH);
    $("#table-container").css("height", windowH);
    $("#h-handler").css("height", windowH);
    $("#mapDiv").css("height", windowH);

    $('#table-container').css('width', widewsPercentage[0] + '%');
    $('.right-container').css('width', (100 - widewsPercentage[0]) + '%')
        .css('left', widewsPercentage[0] + '%');
    $('#h-handler').css('left', widewsPercentage[0] + '%');

    setTimeout(function(){
		 //dom.style.width = (window.innerWidth - $("#table-container").width()
         //    -$("#h-handler").width())+'px';
		 dom.style.height = (window.innerHeight - 55)+'px';
    	myChart.resize();
    },100);
    setTimeout(function(){
		 dom2.style.width = $("#table-container").width()+'px';
		 dom2.style.height = $("#table-container").height()*0.4+'px';
    	myChart2.resize();
    },100);
}