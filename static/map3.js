/**
 * Created by gzy on 2018/1/19
 */

//全局变量


//背景切换所需的数据
var backgroundColor ='#404a59';     //echart背景色
var textColor='#ccc';                   //文字颜色
var emphasisColor='#aaa';;              //播放按钮颜色
var visualMapColorOutOfRange='#4c5665'; //visualMap，范围外颜色
var visualMapColor=['#565AB1','#7EB19A','#9CC63D'];//visualMap颜色变化范围
var browserHeight=$(window).height() ; //浏览器高度
$("#tableDiv").height(browserHeight+"px");
var emphasisAreaColor="#727272";         //选中国家的颜色
var areaColor="#2a333d";              //国家的颜色

//          地图全局变量
var dom2 = document.getElementById("mapContainer2");;//小地图
var myChart2 = echarts.init(dom2);;
var option2 = null;
var geoRegions=[        ];//地图选中国家
var visualMapRange = [1,50];    //visualMap 排序变化范围
var curIndex=0;


//echart    主图全局变量
var dom = document.getElementById("mapContainer");;//   主图
var myChart = echarts.init(dom);;
var option = null;
var seriesData =[]; //  容器，存储线的数据
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//table中选中的那一行 的行数据


var itemStyle = {
    opacity: 0.8,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    };
    // 计算出气泡半径
 var sizeFunction = function (x,averageSize) {
        var y = Math.sqrt(1+x / averageSize) ;
        return y * 80;
    };
var schema = [
    {name: 'GDP per capita', index: 0, text: '人均GDP', unit: '美元'}
    ,{name: 'Welfare per capita', index: 1, text: '人均消耗', unit: '美元'}
    ,{name: 'Country', index: 2, text: '国家', unit: ''}
    ,{name: 'size', index: 3, text: '气泡大小', unit: ''}
    ,{name: 'sort', index: 4, text: '排序', unit: ''}

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
                    continue; //跳过，这些国家无法在echarts的geo地图上是无法显示的
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
    visualMapRange=[0,100];     //初始化
    geoRegions=[];              //初始化
    dom2 = document.getElementById("mapContainer2");
    myChart2 = echarts.init(dom2);
    getGeoRegions(0,visualMapRange[0],visualMapRange[1]);  //获取初始化时，需要获取选中的国家列表
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
            zoom:1,
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
                    borderColor: '#aaa',
                    areaColor: emphasisAreaColor
                }
            },
            itemStyle: {
                borderColor: '#aaa',
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
    if(row.unit && row.unit!==''){
		unit=row.unit;
	}else{
		unit='undefined'
	}
	dom = document.getElementById("mapContainer");
    myChart = echarts.init(dom);
    option={

        baseOption:{

            timeline: {
                axisType: 'category',
                orient: 'horizontal',
                autoPlay: true,		//是否自动播放
                inverse: false,		//是否反向放置 timeline，反向则首位颠倒过来
				rewind :false, 		//是否反向播放
                playInterval: 3000,	//播放速度
                bottom :'3%',
                right:'3%',
                label: {
                	textStyle: {
                            fontFamily:"Times New Roman",	//字体
                            color: textColor
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
					text: '各国人均GDP与人均消耗关系演变',
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
                    return schema[2].text + '：' + value[2] + '<br>'
                            + schema[0].text + '：' + value[0].toFixed(2) + row.unitX + '<br>'
                            + schema[1].text + '：' + value[1].toFixed(2) + row.unitY + '<br>'
                            + schema[3].text + '：' + value[4].toFixed(2)  + '<br>'
                            + schema[4].text + '：' + value[3]  + '<br>'
                            ;
                }
            },
			grid: {
                top: 100,
				bottom:110,
                containLabel: true,
                left: 30,
                right: 30
            },
			xAxis: {
                type: 'value', 		//对数轴。适用于对数数据
                //type: 'value',		//数值轴，适用于连续数据
                name: '人均GDP(单位:'+row.unitX+")",
                max: parseInt(row.xAxisMax),
                min: parseInt(row.xAxisMin),
                nameGap: 25,
                nameLocation: 'middle',
                nameTextStyle: {                    //坐标轴名称的文字样式。
                    fontFamily:"Times New Roman",   //字体
                    fontSize: 18
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
                type: 'log', 		//对数轴。适用于对数数据
                //type: 'value',
                name: '            人均消耗(单位:'+row.unitY+")",     //坐标轴名称
                //offset :-20,
                max: parseInt(row.yAxisMax),
                min: parseInt(row.yAxisMin),
                nameTextStyle: {                    //坐标轴名称的文字样式
                    fontFamily:"Times New Roman",//字体
                    color: textColor,
                    fontSize: 18
                },
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
                    orient :'horizontal',           //水平
                    dimension: 3,                   //指定用数据的『哪个维度』,这个很重要，用这个来确定绑定关系
                    min:1,
                    max:189,
                    range:visualMapRange,
                    left:'',
                    bottom:'5%',
                    //align:'bottom',
                    calculable: true,
                    precision: 0.1,
                    textGap: 30,
                    text:['小','大'],
                    textGap:5,
                    textStyle: {
                        color: textColor,
                        fontFamily:"Times New Roman"	//字体
                    },
                    color: visualMapColor,      //颜色变化范围
                    outOfRange: {               //未选中的
                        symbolSize:0,           //气泡半径
                        opacity:"0",            //透明度
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
                        return sizeFunction(val[3],row.averageSize);
                    }
                }
            ],
			animationDurationUpdate: 3000,			//数据更新动画的时长。
            //animationEasingUpdate: 'cubicInOut'	//数据更新动画的缓动效果
            //animationEasingUpdate: 'quinticInOut'	//数据更新动画的缓动效果
        },
		options: [
        ]
    };
    for(var n=0;n<row.timeline.length;n++){
    	option.baseOption.timeline.data.push(row.timeline[n]);
		option.options.push({
		    //legend: legends,
            series: {
                id: 'gridScatter',
                name: row.timeline[n],
                type: 'scatter',
                itemStyle: itemStyle,
                data: row.series[n],
                symbolSize: function(val) {
                    return sizeFunction(val[3],row.averageSize);
                }
            }
        });
	}
	myChart.setOption(option,true);
    //绑定年份timeline切换 事件
    myChart.on('timelinechanged', function (params) {
        curIndex = params.currentIndex;
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
			seriesData=[];    //  根据进出口类型和选中的省份画的线，清空
			selectedRow=row;
            initEchart(selectedRow);
            initEchart2(selectedRow);//初始化小地图

		},
	    columns: [{
            checkbox: true
        },{
	        field: 'fileName',
	        title: '<span class="tabldTitle">数据列表</span>'
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
	adjustScrollPage();
}
//页面自适应
var adjustScrollPage = function() {
	var windowEl = $(window);
	var windowH = windowEl.height()-50; //减去导航栏的那个高度 50px
    var windowW = windowEl.width();
    $('#bodyId').css('height', windowH).css('width', windowW);
    $("#tableDiv").css("height", windowH);
    //$("#mapDiv").css("height", windowH);
    setTimeout(function(){
		dom.style.width = (window.innerWidth - $("#tableDiv").width())+'px';
		dom.style.height = (window.innerHeight - 55)+'px';
    	myChart.resize();
    },100);
    setTimeout(function(){
		dom2.style.width = $("#tableDiv").width()+'px';
		dom2.style.height = $("#tableDiv").width()*0.4+'px';
    	myChart2.resize();
    },100);
}


//初始化事件绑定
var initEvent = function() {
    //缩进/展开功能
    $("#hideList").bind("click", function(){
		if($(".bootstrap-table").css("display") == 'none') {
			$(".bootstrap-table").show();
			$("#tableDiv").css("width", "33.3%");
			$("#mapDiv").css("width", "66.6%");
			$("#hideList > img").attr("src", "/static/img/left.png").attr("title", "缩进");
			$("#button").show();
			$("#delBtn").show();
			$("#refBtn").show();
			$(".hiddenClass").show();
		}else {
			$(".bootstrap-table").hide();
		  	$("#tableDiv").css("width", "3%");
			$("#mapDiv").css("width", "97%");
			$("#hideList > img").attr("src", "/static/img/right.png").attr("title", "展开");
			$("#button").hide();
			$("#delBtn").hide();
			$("#refBtn").hide();
			$(".hiddenClass").hide();
		}
   	 	adjustScrollPage();
	});
    
    //切换背景色 :  黑色，白色  ，默认黑色
    $("#black_li").bind("click",function() {  //切换成黑色背景
        backgroundColor="#404a59";
        textColor='#ccc';
        emphasisColor='#aaa';
        visualMapColorOutOfRange='#4c5665';
        visualMapColor=['#565AB1','#7EB19A','#9CC63D'];
        emphasisAreaColor="#727272";
        areaColor="#2a333d";
        initEchart(selectedRow);
        initEchart2(selectedRow);//初始化小地图
    })
    
    $("#white_li").bind("click",function() {  //切换成白色背景
        backgroundColor="#FFFAF0";
        textColor='#000000';
        emphasisColor='#555555';
        visualMapColorOutOfRange='#B1B1B1';
        visualMapColor=['orangered','yellow','lightskyblue'];
        emphasisAreaColor="#808080";
        areaColor="#DCDCDC";
        initEchart(selectedRow);
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



















