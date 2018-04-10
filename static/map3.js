
/**
 * Created by gzy on 2018/1/19
 */

//全局变量


//背景切换所需的数据
var backgroundColor ='#404a59';  //echart背景色

var browserHeight=$(window).height() ; //浏览器高度
$("#tableDiv").height(browserHeight+"px");

//echart全局变量
var dom = document.getElementById("mapContainer");;
var myChart = echarts.init(dom);;
var option = null;
var seriesData =[]; //  容器，存储线的数据

var countryShowNum= 50 ;  //   显示的国家数目，默认是50
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedSheet;   		//table中选中的那一行 的行数据

var itemStyle = {
    opacity: 0.8,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    };
    // 计算出气泡半径
 var sizeFunction = function (x,averageSize) {
        //var y = Math.sqrt(x / 5e8) + 0.1;
        var y = Math.sqrt(1+x / averageSize) ;
        console.log(y*80);
        return y * 80;
    };
var schema = [
    {name: 'GDP per capita', index: 0, text: '人均GDP', unit: '美元'}
    ,{name: 'Welfare per capita', index: 1, text: '人均消耗', unit: '美元'}
    ,{name: 'Country', index: 2, text: '国家', unit: ''}
    ,{name: 'size', index: 3, text: '气泡大小', unit: ''}
    ,{name: 'sort', index: 4, text: '排序', unit: ''}

];
var legends= {
                orient: 'vertical',
                bottom:"5%",
                left:"5%",
                //x: 'left',
                //y:'',
                //z:3,
                data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            }

/* 初始化echart  ,第一次打开页面时或者点击表格行事件时，调用本函数
*  入参：表格的行数据  */
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
                            color: '#ccc'
                        }
                },
                symbol: 'none',
                lineStyle: {
                    color: '#ccc'
                },
                checkpointStyle: { //
                    color: '#bbb',
                    borderColor: '#777',
                    borderWidth: 2
                },
                controlStyle: { //播放按钮
                    showNextBtn: false,
                    showPrevBtn: false,
                    normal: {
                        color: '#ccc',
                        borderColor: '#ccc'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
                data: []
            },
			backgroundColor: '#404a59',				//背景
			title: [ 									//标题
				{
					text: '各国人均GDP与人均消耗关系演变',
					left: 'center',
					top: 10,
					textStyle: {
						fontFamily:"Times New Roman",	//字体
						color: '#ccc',
						fontWeight: 'normal',
						fontSize: 20
					},
					subtext: 'Unit：'+row.unit,				//副标题
					subtextStyle : {  						//副标题
						fontFamily:"Times New Roman",	//字体
						color: '#ccc'
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
                        color: '#ccc'	//坐标轴线线的颜色
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
                    color: '#ccc',
                    fontSize: 18
                },
                axisLine: {                 //坐标轴轴线设置
                    lineStyle: {
                        color: '#ccc'
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
                // {//国家
                //     type: 'piecewise',
                //     show: false,
                //     dimension: 2,                   //指定用数据的『哪个维度』,这个很重要，用这个来确定绑定关系
                //     categories: row.counties,
                //     calculable: true,
                //     precision: 0.1,
                //     textGap: 30,
                //     textStyle: {
                //         color: '#ccc'
                //     },
                //     inRange: {
                //         color: [
                //             '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a', '#376956',
                //             '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a', '#376956',
                //             '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a', '#376956',
                //             '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a', '#376956',
                //             '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a', '#376956',
                //             '#bcd3bb', '#e88f70', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a', '#376956',
                //             '#c3bed4', '#495a80', '#9966cc', '#bdb76a', '#eee8ab', '#a35015', '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc','#c5c975','#476a54','#66e638','#a59619','#822ee2','#49450d','#eeebd4','#2b98dc','#b95c25', '#8f1ec2', '#d50390', '#36a15d', '#edc1a5'
                //             ,'#c3bed4', '#495a80', '#9966cc', '#bdb76a', '#eee8ab', '#a35015', '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc','#c5c975','#476a54','#66e638','#a59619','#822ee2','#49450d','#eeebd4','#2b98dc','#b95c25', '#8f1ec2', '#d50390', '#36a15d', '#edc1a5'
                //             ,'#c3bed4', '#495a80', '#9966cc', '#bdb76a', '#eee8ab', '#a35015', '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc','#c5c975','#476a54','#66e638','#a59619','#822ee2','#49450d','#eeebd4','#2b98dc','#b95c25', '#8f1ec2', '#d50390', '#36a15d', '#edc1a5'
                //             ,'#c3bed4', '#495a80', '#9966cc', '#bdb76a', '#eee8ab', '#a35015', '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc','#c5c975','#476a54','#66e638','#a59619','#822ee2','#49450d','#eeebd4','#2b98dc','#b95c25', '#8f1ec2', '#d50390', '#36a15d', '#edc1a5'
                //             ,'#c3bed4', '#495a80', '#9966cc', '#bdb76a', '#eee8ab', '#a35015', '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc','#c5c975','#476a54','#66e638','#a59619','#822ee2','#49450d','#eeebd4','#2b98dc','#b95c25', '#8f1ec2', '#d50390', '#36a15d', '#edc1a5'
                //             ,'#c3bed4', '#495a80', '#9966cc', '#bdb76a', '#eee8ab', '#a35015', '#04dd98', '#d9b3e6', '#b6c3fc','#315dbc','#c5c975','#476a54','#66e638','#a59619','#822ee2','#49450d','#eeebd4','#2b98dc','#b95c25', '#8f1ec2', '#d50390', '#36a15d', '#edc1a5'
                //         ]
                //     },
                //     outOfRange: {
                //         //color: '#555'
                //         color: '#bcd3bb'
                //     }
                // },
                {           //排序
                    type: 'continuous',
                    show: true,
                    orient :'horizontal',           //水平
                    dimension: 3,                   //指定用数据的『哪个维度』,这个很重要，用这个来确定绑定关系
                    min:1,
                    max:189,
                    range:[1,50],
                    left:'',
                    bottom:'5%',
                    //align:'bottom',
                    calculable: true,
                    precision: 0.1,
                    textGap: 30,
                    text:['小','大'],
                    textGap:5,
                    textStyle: {
                        color: '#ccc',
                        fontFamily:"Times New Roman"	//字体
                    },
                    //color: ['orangered','yellow','lightskyblue'],
                    color: ['green','yellow','lightskyblue'],
                    outOfRange: {               //未选中的
                        symbolSize:0,           //气泡半径
                        opacity:"0",            //透明度
                        color: '#4c5665'
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

    //绑定 年份切换 事件
    myChart.on('timelinechanged', function (params) {
        //console.log(params);

        //myChart.setOption(option,true);

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
			initEchart(row);
			selectedSheet=row;
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
		initEchart(datas[0]);
		selectedSheet=datas[0];
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
    setTimeout(function(){
		dom.style.width = (window.innerWidth - $("#tableDiv").width())+'px';
		dom.style.height = (window.innerHeight - 55)+'px';
    	myChart.resize();
    },100);
}




//初始化事件绑定
var initEvent = function() {

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



















