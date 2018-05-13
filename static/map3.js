/**
 * Created by gzy on 2018/1/19
 */

//全局变量

//背景切换所需的数据
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
//var browserHeight=$(window).height() ; //浏览器高度


//    echart      地图全局变量
var dom2 = document.getElementById("mapContainer2");;//小地图
var myChart2 = echarts.init(dom2);;
var option2 = null;
var geoRegions=[        ];//地图选中国家
var visualMapRange = [1,50];    //visualMap 排序变化范围
var curIndex=0;             //当前年,默认是第一年
var emphasisAreaColor="#fff";         //选中国家的颜色
var areaColor="#404a59";              //国家的颜色
var borderColor="#aaa";                     //国家边界颜色

//  echart    主图全局变量
var dom = document.getElementById("mapContainer");;//   主图
var myChart = echarts.init(dom);;
var option = null;
var seriesData =[]; //  容器，存储线的数据
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//table中选中的那一行 的行数据
var switchTime =2000;       //切换时间 2秒


//缩放功能 数据区，
var widewsPercentage=[40,40];       //窗体左右比例    初始化,左边是 40%  。记录两个40，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例
var gb = {
    handler: {          //一个锁
        isDown: false
    },
    lock:false       //是否锁死缩放栏,默认是false。但是点击缩进按钮后，缩放栏会锁死，不允许缩放。
}

//配置数据
var itemStyle = {
    opacity: 0.7,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)'
    };
// 计算出气泡半径
//根据 原始气泡数据与平均值的比值关系来计算，
//当比值太大的时候，要做一些处理，不然数据效果不好看
var sizeFunction = function (x,averageSize) {
    // var y = Math.sqrt(0.01+x / averageSize) ;
    // console.log(y * 30+1)
    // return y * 30+1;                         //一种方案
    var z=x / averageSize;                      //比值关系
    var y=0;
    // return (Math.log(Math.E+z)-1)*50+0.3;    //一种方案
    if(z<0.1){
        y=Math.sqrt(0.01+z)*25+1
    }else if(z>10){
        y=Math.sqrt(0.01+10)*25+1 + (z-10)*1.5
    }else{
        y=Math.sqrt(0.01+z)*25+1
    }
    return y;
};
var schema = [

    {name: 'Welfare per capita', index: 1, text: 'Welfare', unit: '美元'}
    ,{name: 'GDP per capita', index: 0, text: 'GDP', unit: '美元'}
    ,{name: 'Country', index: 2, text: 'Region', unit: ''}
    ,{name: 'size', index: 3, text: ' Size', unit: ''}
    ,{name: 'sort', index: 4, text: ' Rank', unit: ''}
];

/*
*   更新最新的 geoRegions
* */
var getGeoRegions = function(){
    geoRegions=[]; //先清空
    if(selectedRow ==null || selectedRow.length==0 ){
        console.log("当前选中行为空");
        return geoRegions;
    }
    var series=selectedRow.series[curIndex];
    for(var i=0;i<series.length;i++){
        var sort=series[i][3];
        if(sort<=visualMapRange[1] && sort>=visualMapRange[0]){//如果在这个范围内，那么就选中
            var counName =series[i][2];
            if(countrySwitch[counName]!=null ){  //如果可以转换
                if(countrySwitch[counName]!=""){    //此时转换名字
                    counName=countrySwitch[counName];
                }else{
                    continue; //跳过，这些国家无法在echarts的geo地图上是无法显示的。因为echarts不存在这些国家
                }
            }
            geoRegions.push({name: counName ,selected:true});
        }
    }
}

/*初始化小地图 echart */
var initEchart2 = function(row){
    console.log("初始化地图echarts！");
    if(myChart2&&myChart2.dispose){
        myChart2.dispose();
    }
    curIndex=0;                 //初始化
    geoRegions=[];              //初始化
    dom2 = document.getElementById("mapContainer2");
    myChart2 = echarts.init(dom2);
    getGeoRegions();  //获取初始化时，需要获取选中的国家列表
    option2={
        backgroundColor:backgroundColor,				//背景
        geo: {              //小地图
            show:true,
            name: 'maps',
            type: 'map',
            map: 'world',
            aspectScale :1,//用于 scale 地图的长宽比。
            roam: true,
            silent:true,            //不响应鼠标点击事件
            selectedMode:'multiple',      //支持选中多个
            selected:true,
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
    myChart2.setOption(option2,true);
}



/*  入参：表格的行数据  */
var initEchart=function(row){
    if(myChart&&myChart.dispose){
		myChart.dispose();
	}
	unit='';  //单位
    unit=row.unit;
	dom = document.getElementById("mapContainer");
    myChart = echarts.init(dom);
    curIndex=0;
    option={
        baseOption:{
            timeline: {
                axisType: 'category',
                orient: 'horizontal',
                autoPlay: false,		//是否自动播放
                inverse: false,		//是否反向放置 timeline，反向则首位颠倒过来
				rewind :false, 		//是否反向播放
                playInterval: switchTime,	//播放速度
                bottom :'3%',
                label: {
                    normal: {           //年份效果
                        textStyle: {
                            fontFamily:"Times New Roman",	//字体
                            color: textColor
                        }
                    },
                    emphasis: {         //年份点击时效果
                        textStyle: {
                            fontFamily:"Times New Roman",	//字体
                            //fontWeight :"bold",
                            fontSize  :14,
                            color: textEmphasisColor
                        }
                    }
                },
                symbol: 'none',
                lineStyle: {
                    color: textColor
                },
                checkpointStyle: { //『当前项』（checkpoint）的图形样式。
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
                        borderColor: emphasisColor
                    }
                },
                data: []
            },
			backgroundColor:backgroundColor,				//背景
			title: [ 									//标题
				{
					text: row.fileName,
					left: 'center',
					top: 10,
					textStyle: {
						fontFamily:"Times New Roman",	//字体
						color: textColor,
						fontWeight: 'normal',
						fontSize: 20
					},
					subtext: 'Unit：'+row.unit,				//副标题
					subtextStyle : {  						//副标题
						fontFamily:"Times New Roman",	//字体
						color: textColor
					},
				}
			],
            tooltip: {										//提示框组件
                padding: 5,
                backgroundColor: '#222',
                borderColor: '#777',
                borderWidth: 1,
                formatter: function (obj) {
                    var value = obj.value;
                    if(value[3]<visualMapRange[0] || value[3]>visualMapRange[1]){           //未选中的范围，不显示提示框
                        return;
                    }
                    console.log(typeof(value));
                    if(typeof(value)!="object"){
                        return;
                    }
                    return schema[2].text + '：' + value[2] + '<br>'
                            + schema[0].text + '：' + value[0].toFixed(2)   + '<br>'
                            + schema[1].text + '：' + value[1].toFixed(2)  + '<br>'
                            + schema[3].text + '：' + value[4].toFixed(2)  + '<br>'
                            + schema[4].text + '：' + value[3]  + '<br>'
                            ;
                }
            },
			grid: {
                top: 100,
				bottom:110,
                containLabel: true,
                left: 50,
                right: 30
            },
			xAxis: {
                type: 'value', 		//对数轴。适用于对数数据
                name: 'Welfare per capita  ('+row.unitX+")",
                //max: parseInt(row.xMax),
                max: Math.round(row.xMax/Math.pow(10,row.xMax.toString().length-1)) * Math.pow(10,row.xMax.toString().length-1),
                min: parseInt(row.xMin),
                nameGap: 25,
                nameLocation: 'middle',
                nameGap :35,                //坐标轴名称与轴线之间的距离。
                nameTextStyle: {                    //坐标轴名称的文字样式。
                    fontFamily:"Times New Roman",   //字体
                    fontSize: 15
                },
                splitLine: {  			//  分割线
                    show: false
                },
                axisLine: {			//坐标轴轴线设置
                    lineStyle: {
                        color: textColor	//坐标轴线线的颜色
                    }
                },
                axisLabel: {			//坐标轴刻度标签
                    formatter: '{value}'
                }
            },
			yAxis: {
                //type: 'log', 		//对数轴。适用于对数数据
                type: 'log',
                name: 'GDP per capita  ('+row.unitY+")",     //坐标轴名称
                max: row.yMax,
                min: row.yMin,
                nameTextStyle: {                    //坐标轴名称的文字样式
                    fontFamily:"Times New Roman",//字体
                    color: textColor,
                    fontSize: 15
                },
                nameRotate :90,             //坐标轴名字旋转，角度值。
                nameLocation :"middle",     //坐标轴名称显示位置
                nameGap :55,                //坐标轴名称与轴线之间的距离。
                axisLine: {                 //坐标轴轴线设置
                    lineStyle: {
                        color: textColor
                    }
                },
                splitLine: {                //  分割线
                    show: false
                },
                axisLabel: {                //坐标轴刻度标签的相关设置。
                    formatter: '{value}'
                }
            },
            visualMap: [
                {           //
                    type: 'continuous',
                    show: true,
                    orient :'vertical',           //垂直 。  水平：   horizontal
                    dimension: 3,                   //指定用数据的『哪个维度』,这个很重要，用这个来确定绑定关系
                    min:1,
                    max:189,
                    range:visualMapRange,
                    left:'10',
                    bottom:'5%',
                    hoverLink :false,
                    realtime :false,        //拖拽时，是否实时更新 。注意 ，如果设置为true，可能会出现一些bug，比如气泡隐藏后，鼠标放上去依然有效果
                    //align:'top',
                    calculable: true,
                    precision: 0.1,
                    textGap: 30,
                    text:['Min','Max'],
                    textGap:5,
                    textStyle: {
                        color: textColor,
                        fontFamily:"Times New Roman"	//字体
                    },
                    color: visualMapColor,      //颜色变化范围
                    outOfRange: {               //未选中的
                        symbolSize:0,           //气泡半径
                        opacity:0,            //透明度
                        color: visualMapColorOutOfRange
                    }
                }
            ],

            series: [
                {
                    type: 'scatter',
                    id: 'gridScatter',
                    itemStyle: itemStyle,
                    data: [],
                    symbolSize: function(val) {
                        return sizeFunction(val[4],row.averageSize);
                    }
                }
            ],
			animationDurationUpdate: switchTime,			//数据更新动画的时长。
            //animationEasingUpdate: 'cubicInOut'	//数据更新动画的缓动效果
            //animationEasingUpdate: 'quinticInOut'	//数据更新动画的缓动效果
        },
		options: [
        ]
    };
    for(var n=0;n<row.timeline.length;n++){
    	option.baseOption.timeline.data.push(row.timeline[n]);
		option.options.push({
            series: {
                id: 'gridScatter',
                name: row.timeline[n],
                type: 'scatter',
                itemStyle: itemStyle,
                data: row.series[n],
                symbolSize: function(val) {
                    return sizeFunction(val[4],row.averageSize);
                }
            }
        });
	}
	myChart.setOption(option,true);
    //绑定年份timeline 切换事件
    myChart.on('timelinechanged', function (params) {
        curIndex = params.currentIndex;
        if(selectedRow.emptySheets.indexOf(selectedRow.timeline[curIndex].toString())!=-1){      //，如果点了空sheet这时直接跳过，切换到不是空的那年sheet数据
            var allYears=selectedRow.timeline;
            allYears=allYears.concat(allYears);
            var emptyYears=selectedRow.emptySheets;
            var index=curIndex+1;           //目标年的index
            for( ; index<allYears.length ; index++){
                if(emptyYears.indexOf(allYears[index]) ==-1){   //如果不是空，那么就是这年
                    curIndex=index % (allYears.length/2); //求余
                    myChart.dispatchAction({
                        type: 'timelineChange',
                        // 时间点的 index
                        currentIndex: curIndex
                    });
                    break;
                }
            }
        }
        getGeoRegions();
        option2.geo.regions=geoRegions;
        myChart2.setOption(option2,true);

    });
    /* 绑定visualMap 切换事件 */
    myChart.on('datarangeselected', function (params) {
        visualMapRange=[Math.round(params.selected[0]), Math.round(params.selected[1])];
        getGeoRegions();
        option2.geo.regions=geoRegions;
        myChart2.setOption(option2,true);

    });
}


//初始化渲染表格数据
var initTable = function(datas){
	$("#tableDiv").css("padding-right", 0);
	$('#tableContainer').bootstrapTable('destroy');//先销毁表格
	$('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			selectedPros=[];  //选中的省份,清空
			geoData=[];       // option中的regions，对选中的省份设备背景色 ,清空
			seriesData=[];    //  根据
			selectedRow=row;
            initEchart(selectedRow);
            initEchart2(selectedRow);//初始化小地图

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
		initEchart(selectedRow);
		initEchart2(selectedRow);//初始化小地图

	}
	$('#loading').modal('hide');
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

//初始化事件绑定
var initEvent = function() {
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
        getGeoRegions();
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
        getGeoRegions();
        initEchart2(selectedRow);//初始化小地图
    })
}


/*初始化上传组件*/
var initUpload = function(ctrlName, uploadUrl){
	 var control = $('#' + ctrlName);
	 control.fileinput({
		language: 'zh', //设置语言
		uploadUrl:uploadUrl,  //上传的地址
		showUpload: true,
		maxFileCount: 1,
		maxFileSize:1000,  //单位为kb，如果为0表示不限制文件大小
		enctype: 'multipart/form-data',
		mainClass: "input-group-lg"
	 }).on("fileuploaded",function(event, data, previewId, index){  //上传结果处理
		console.log(data);
		$("#addButtonResult").append("<p>"+data.response.message+"<p>");
		if("true"==data.response.result){ //刷新表格
			refBtnFn();
		}else if ("false"==data.response.result){
			//不操作
		}
	 });
}


//删除表格行
var delBtnFn = function() {
	$("#deleteResult").html("正在删除数据，请稍候...");
	var selectedData= $('#tableContainer').bootstrapTable('getSelections');
	if(typeof selectedData === null || selectedData.length == 0) {
		$.Message.popup("提示", "请选中要删除的数据!");
		return;
	}
	$('#deleteModel').modal('show');
	$('#deleteModel').on('shown.bs.modal', function () {
		var data='';
		$.each(selectedData, function(i, item) {
			data=data+','+item.fullFileName;
		});
		data=data.substring(1,data.length)
		$.ajax({
			type:"GET",
			async:true,
			url:"/deleteDataInMap3",
			data:{fileNameList:data},
			success:function(data){
				initData();
				$("#deleteResult").html(data);
			}
		});
    });
}

//刷新左侧表格
var refBtnFn =function(){
	$('#loading').modal('show');
	$('#loading').on('shown.bs.modal', function () {
		initData();
	})
}


//初始化页面表格数据
var initData=function(){
	$.ajax({
        type:"GET",
        async:false,
        url:"/initMap3",
        success:function (data) {
	        console.log(" initMap3 扫描成功");
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



















