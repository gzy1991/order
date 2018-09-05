
/**
 * Created  on 2018/9/06.
 *
 */

/*背景切换所需的数据*/
var backgroundColor ='#404a59';     //echart背景色
var textColor='#ccc';                   //文字颜色
var areaColor ='#404a59'; //地图区域的颜色
var emphasisAreaColor='#485963';   //选中国家时，背景色
var BRCountryColor="#75ffef";                  //BR国家的背景颜色
var lineColor ="#FF3030";					//线和线上提示框的颜色
var geoTextColor="#fff";            //地图上，选中国家时，国家名的颜色
var lineEffectColor = "#fff";   //线上特效点的颜色

/*显示类型，，all:显示全部国家   ，BR:显示63个BR国家  */
var countryType="all";

/*全局数据*/
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var widewsPercentage=[35,35];       //窗体左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。


/*世界地图*/
var dom= document.getElementById("mapContainer");;//
var myChart ;
var option ;
var seriesData =[]; //  容器，存储线数据
var selectedCountrys= [];  	//图中选中的国家名集合,存储的是echarts中的国家名
var geoData=[]        ;     //选中的国家
var lines=[] ;                 //线数据  ，数据容器
var borderColor="#aaa";                     //省份边界颜色

//获取页面表格数据
var initPageData=function(){
	$.ajax({
        type:"GET",
        async:false,
        url:"/initMap6",
        success:function (data) {
	        console.log(" initMap6 扫描成功");
	        datas=JSON.parse(data);
	        initTable(datas);
	        adjustScrollPage(); //页面自适应
	        //页面加载完
            $(function(){
				$(".fixed-table-body").css("overflow", "hidden");
				$("#tableContainer > tbody > tr > td").css("cursor", "pointer");
            });
        }
	})
}


/*初始化表格*/
var initTable=function(datas){
    $("#tableDiv").css("padding-right", 0);
	$('#tableContainer').bootstrapTable('destroy');//先销毁表格
    $('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			selectedRow=row;
            seriesData=[];              //线数据
            selectedCountrys=[];       //选中的国家
            initEchart(selectedRow);   //初始化世界地图
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
		initEchart(selectedRow);   //初始化世界地图
	}
	$('#loading').modal('hide');
}



/*
* 初始化世界地图
*/
var initEchart= function(){
    console.log("初始化世界地图echarts!");
    if(myChart&&myChart.dispose){
        myChart.dispose();
    }
    dom= document.getElementById("mapContainer");
    myChart = echarts.init(dom);

    generateSeries();//生成线数据
    generateMapDate();//生成地图上 国家的选中数据，和BR国家的颜色数据
    option= {

    }
    ;
    // myChart.setOption(option, true);
    // //绑定国家的点击事件
    // myChart.on("click",function(params){
    //
    // })
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

    setTimeout(function(){/*世界地图*/
         dom2.style.height = (window.innerHeight - 55)+'px';
         myChart2.resize();
    },100);
    setTimeout(function(){/*中国地图*/
        dom.style.width = $("#table-container").width()+'px';
		 dom.style.height = $("#table-container").height()*0.4+'px';
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
    percentage = Math.min(0.50, Math.max(0.30, percentage));  // 比例极限区间是 [30,50]
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

    /*显示全部国家*/
    $("#all_li").bind("click",function() {
        countryType="all";
        selectedCountrys=[];//清空选中的国家
        geoData=[];//清空地图上选中的国家
        initEchart2();//
        initEchart();//
    })

     /*显示BR国家*/
    $("#br_li").bind("click",function() {
        countryType="BR";
        selectedCountrys=[];//清空选中的国家
        geoData=[];//清空地图上选中的国家
        initEchart2();//
        initEchart();
    })

    /*切换背景色 :  黑色，白色  ，默认黑色*/
    $("#black_li").bind("click",function() {  //切换成黑色背景
        backgroundColor="#404a59";
        textColor='#ccc';
        emphasisColor='#aaa';
        visualMapColorOutOfRange='#4c5665';
        emphasisAreaColor="#485963";
        areaColor="#404a59";
        textEmphasisColor="#fff";
        borderColor="#aaa";
        geoTextColor="#fff";
        lineEffectColor="#fff";
        BRCountryColor="#75ffef";
        initEchart(selectedRow);
        initEchart2(selectedRow);//
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
        lineEffectColor="#fff";
        geoTextColor="#2a333d";
        BRCountryColor="#f0ff73";

        initEchart(selectedRow);
        initEchart2(selectedRow);//
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap6",refBtnFn);
    })
}
