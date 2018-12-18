
/**
 * Created by gzy on 2018/12/13
 */


/*地图全局数据*/
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var widewsPercentage=[30,30];       //存储窗体当前的左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。
var leftMinWidth = $("#buttonArea").width()+$("#hideList").width()+$("#h-handler").width();//左侧按钮区的最小宽度
var MinPercentage = 0.3 ;//窗体左右比例的最小值，默认是0.3，打开页面的时候，要初始化
var MaxPercentage = 0.5 ;//窗体左右比例的最大值，默认是0.5，
/*计算窗体左右比例的最小值*/
var calculateMinPercentage = function(){
    //  比例= 左边按钮区的宽度/整体宽度
    MinPercentage = leftMinWidth/$(window).width() ;
    MinPercentage = Math.ceil(MinPercentage*100)/100 ;//舍去小数点后两位后面的数据
}

//滚动轴 数据
var switchTime =2000;       //动画切换时间 2秒

/*背景切换所需的数据*/
var backgroundColor ='#404a59';         //echart背景色
var areaColor ='#323c48';               //地图区域的颜色
var emphasisAreaColor='#2a333d';        //选中省份时，背景色
var textColor='#fff';					//标题与副标题的颜色
var lineColor ="#FF3030";					//线和线上标签的颜色
var lineeffectColor = "#fff";               //线上特效点的颜色
var textEmphasisColor="#fff";               //年份选中时颜色
var emphasisColor='#aaa';;              //播放按钮颜色

var browserHeight=$(window).height() ; //浏览器高度
$("#tableDiv").height(browserHeight+"px");


/*中国地图*/
var dom = document.getElementById("mapContainer");;
var myChart = echarts.init(dom);;
var option = null;
var emphasisAreaColor="#ffffff";         //选中省份的颜色
var areaColor="#404a59";              //省份的颜色
var borderColor="#aaa";                     //省份边界颜色
var selectedPros= "Beijing";  	//图中选中的省份名，默认是北京
//地图选中省份，  选中的省份,初始化的时候是空.当点击省份时，更新这个数据。.
// 默认是北京.最多只能选一个省份
var  geoData=[
    {name:"Beijing",selected:true }
    ,{name:"北京",selected:true }
];
var curIndex=0;             //滚动轴当前项,默认是第一个
var seriesData =[];         //  容器，存储 数据
var unit='';  //单位




/* 初始化echart  ,第一次打开页面时或者点击表格行事件时，调用本函数
*  入参：表格的行数据  */
var initEchart = function(row){
    console.log("初始化中国地图echarts!");
    if(myChart&&myChart.dispose){
        myChart.dispose();
    }
    dom= document.getElementById("mapContainer");
    myChart = echarts.init(dom);

    seriesData=[];                  //清空线数据
    generateLineSeries();               //生成线数据
    generateMapDate();              //生成地图上 省份的选中数据，
    option={
        baseOption:{
            backgroundColor:backgroundColor,				//背景
            /*  时间轴 */
            timeline:{
                
            },
            
            series:[
                /*中国I地图*/
                {
                    
                },
                /**/
                {

                }
            ]
            
            
        },
        


    }


}



//获取页面表格数据
var initPageData=function(){
	$.ajax({
        type:"GET",
        async:false,
        url:"/initMap7",
        success:function (data) {
	        console.log(" initMap7 扫描成功");
	        datas=JSON.parse(data);
	        initTable(datas)
	        adjustScrollPage(); //页面自适应
	        //页面加载完
            $(function(){
				$(".fixed-table-body").css("overflow", "hidden");
				$("#tableContainer > tbody > tr > td").css("cursor", "pointer");
            });
            calculateMinPercentage();//计算窗体左右比例的最小值
            setSplitPosition(MinPercentage);//根据窗体左右比例的最小值，设置窗口比例
        }
	})
}

/*初始化渲染表格*/
var initTable=function(datas){
    //$("#tableDiv").css("padding-right", 0);
	$('#tableContainer').bootstrapTable('destroy');//先销毁表格
    $('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			selectedPros="Beijing";        //选中的省份,改为默认省份
            geoData=[{name:"Beijing",selected:true },{name:"北京",selected:true }  ];
			seriesData=[];          //
			selectedRow=row;
            initEchart(selectedRow);    //初始化中国地图
		},
	    columns: [{
            checkbox: true
        },{
	        field: 'fileName',
	        title: '<span class="tabldTitle">Excel List</span>'
	    }],
	    data: datas
	});
	if(datas && datas.length>0){
		console.log("第一次初始化echart: "+datas[0].fileName);
		selectedRow=datas[0];
		initEchart(selectedRow);    //初始化中国地图
	}
	$('#loading').modal('hide');
}

/*初始化中国地图*/
var initEchart = function(row){
     console.log("初始化中国地图echarts！");
     if(myChart&&myChart.dispose){
        myChart.dispose();
    }
    curIndex=0;                 //初始化
    dom = document.getElementById("mapContainer");
    myChart = echarts.init(dom);


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

    setTimeout(function(){/*中国地图*/
         dom.style.height = (window.innerHeight - 55)+'px';
         myChart.resize();
    },100);
}

/*数据区*/
var gb = {
    handler: {          //一个锁
        isDown: false
    },
    lock:false       //是否锁死缩放栏,默认是false。但是点击缩进按钮后，缩放栏会锁死，不允许缩放。
}

// 缩放功能
/*
*   h-handler ： 缩放栏id
*   adjustScrollPage:回调函数
*
* */
var initEventHandler = function(handler){
    // reset typing state
    $('#'+handler).mousedown(function() {
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
    calculateMinPercentage();/*重新计算最小比例*/
    setSplitPosition(MinPercentage);//重新设置 左右两侧新的比例
    adjustScrollPage();
}


//刷新左侧表格
var refBtnFn =function(){
	$('#loading').modal('show');
	$('#loading').on('shown.bs.modal', function () {
		initPageData();
	})
}


/*初始化事件绑定*/
var initEvent = function(){
    //缩进/展开功能
    $("#hideList").bind("click", function(){
        var windowW = $(window).width();
		if($(".bootstrap-table").css("display") == 'none') { //显示
            gb.lock=false;          //开放 缩放功能
			$(".bootstrap-table").show();
			$("#hideList > img").attr("src", "/static/img/left.png").attr("title", "缩进");
			$("#button").show();
			$("#delBtn").show();
			$("#refBtn").show();
			$(".hiddenClass").show();
			widewsPercentage[0]=widewsPercentage[1];
		}else {                                             //隐藏
            gb.lock=true;           //关闭缩放功能
			$(".bootstrap-table").hide();
			$("#hideList > img").attr("src", "/static/img/right.png").attr("title", "展开");
			$("#button").hide();
			$("#delBtn").hide();
			$("#refBtn").hide();
			$(".hiddenClass").hide();
			widewsPercentage[0]=100*28/windowW;     //计算一个合适的比例，使缩放按钮可以正常显示
		}
   	 	adjustScrollPage();
	});

    //切换背景色 :  黑色，白色  ，默认黑色
    $("#black_li").bind("click",function() {  //切换成黑色背景
        backgroundColor="#404a59";
        textColor='#ccc';
        emphasisColor='#aaa';
        visualMapColorOutOfRange='#4c5665';
        emphasisAreaColor="#FFFFFF";
        areaColor="#404a59";
        textEmphasisColor="#fff";
        borderColor="#aaa";
        initEchart(selectedRow);
    })

    $("#white_li").bind("click",function() {  //切换成白色背景
        backgroundColor="#C1C1C1";
        textColor='#444444';
        emphasisColor='#555555';
        visualMapColorOutOfRange='#B1B1B1';
        emphasisAreaColor="#FFFFFF";
        areaColor="#C1C1C1";
        textEmphasisColor="#000000";
        borderColor="#555555";
        initEchart(selectedRow);
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap7",refBtnFn);
    })

}
