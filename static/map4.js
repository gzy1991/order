/**
 * Created by gzy on 2018/5/11
 */

/*背景切换所需的数据*/
var backgroundColor ='#404a59';     //echart背景色
var textColor='#ccc';                   //文字颜色
var textEmphasisColor="#fff";               //年份选中时颜色
var emphasisColor='#aaa';;              //播放按钮颜色
var visualMapColorOutOfRange='#4c5665'; //visualMap，范围外颜色
var visualMapColor=[//visualMap颜色变化范围
    "#33a5c6",
    "#1BB116",
    "#c67f58"
];

/*地图全局数据*/
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var widewsPercentage=[40,40];       //窗体左右比例    初始化,左边是 40%  。记录两个40，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例


//滚动轴 数据
var visualMapRange = [1,50];    //visualMap 排序变化范围
var curIndex=0;             //滚动轴当前项,默认是第一年项
var switchTime =2000;       //动画切换时间 2秒

/*中国地图*/
var dom = document.getElementById("mapContainer");;//
var myChart = echarts.init(dom);;
var option=null;
var geoRegions=[        ];//地图选中省份，
var emphasisAreaColor="#fff";         //选中省份的颜色
var areaColor="#404a59";              //省份的颜色
var borderColor="#aaa";                     //省份边界颜色

/*世界地图*/
var dom2= document.getElementById("mapContainer2");;//
var myChart2 = echarts.init(dom2);;
var option2 = null;
var seriesData =[]; //  容器，存储数据

//提示框配置数据
var itemStyle = {
    opacity: 0.7,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)'
    };
var schema = [
    {name: 'Welfare per capita', index: 1, text: 'Welfare', unit: '美元'}
    ,{name: 'GDP per capita', index: 0, text: 'GDP', unit: '美元'}
    ,{name: 'Country', index: 2, text: 'Region', unit: ''}
    ,{name: 'size', index: 3, text: ' Size', unit: ''}
    ,{name: 'sort', index: 4, text: ' Rank', unit: ''}
];

//获取页面表格数据
var initPageData=function(){
	$.ajax({
        type:"GET",
        async:false,
        url:"/initMap4",
        success:function (data) {
	        console.log(" initMap4 扫描成功");
	        datas=JSON.parse(data);
	        initTable(datas)
	        adjustScrollPage(); //页面自适应
	        //页面加载完
            $(function(){
				$(".fixed-table-body").css("overflow", "hidden");
				$("#tableContainer > tbody > tr > td").css("cursor", "pointer");
            });
        }
	})
}

/*初始化渲染表格*/
var initTable=function(datas){
    $("#tableDiv").css("padding-right", 0);
	$('#tableContainer').bootstrapTable('destroy');//先销毁表格
    $('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			selectedPros=[];        //选中的省份,改为默认身份  todo
			//geoData=[];             // option中的regions，对选中的省份设备背景色 ,清空
			seriesData=[];          //  根据进出口类型和选中的省份画的线，清空
			selectedRow=row;
            initEchart(selectedRow);    //初始化中国地图
            initEchart2(selectedRow);   //初始化世界地图

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
		initEchart2(selectedRow);   //初始化世界地图

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
    option={
        backgroundColor:backgroundColor,				//背景
        geo: {              //小地图
            show:true,
            name: 'maps',
            type: 'map',
            map: 'china',
            aspectScale :1,//用于 scale 地图的长宽比。
            roam: true,
            silent:false,            //不响应鼠标点击事件
            selectedMode:'single',      //只能选一个
            selected:true,//?
            zoom:1.2,
            scaleLimit:{//滚轮缩放的极限控制，通过min, max最小和最大的缩放值
                min:0.8,
                max:2
            },
            regions:geoRegions,

            emphasis:{      //选中国家的颜色
                label:{
                    show:false
                },
                itemStyle:{
                    borderColor: borderColor,
                    areaColor: emphasisAreaColor
                }
            },
            itemStyle: {
                borderColor: borderColor,
                areaColor: areaColor
            }
        }
    };
    myChart.setOption(option,true);
}


/*初始化世界地图*/
var initEchart2= function(row){

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
		 //dom.style.height = (window.innerHeight - 55)+'px';
    	//myChart.resize();
    },100);
    setTimeout(function(){
		 //dom2.style.width = $("#table-container").width()+'px';
		 //dom2.style.height = $("#table-container").height()*0.4+'px';
    	//myChart2.resize();
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
        visualMapColor=["#33a5c6",
            "#1BB116",
            "#c67f58"];
        emphasisAreaColor="#727272";
        areaColor="#404a59";
        textEmphasisColor="#fff";
        borderColor="#aaa";
        initEchart(selectedRow);
        //getGeoRegions();
        initEchart2(selectedRow);//初始化小地图
    })

    $("#white_li").bind("click",function() {  //切换成白色背景
        backgroundColor="#C1C1C1";
        textColor='#444444';
        emphasisColor='#555555';
        visualMapColorOutOfRange='#B1B1B1';
        visualMapColor=['orangered','yellow','lightskyblue'];
        emphasisAreaColor="#555555";
        areaColor="#C1C1C1";
        textEmphasisColor="#000000";
        borderColor="#555555";
        initEchart(selectedRow);
        //getGeoRegions();
        initEchart2(selectedRow);//初始化小地图
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap3",initData());
    })

}




