
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
var geoTextColor="#fff";            //地图上，选中省份时，省份名的颜色


var browserHeight=$(window).height() ; //浏览器高度
$("#tableDiv").height(browserHeight+"px");


/*中国地图*/
var dom = document.getElementById("mapContainer");
var myChart = echarts.init(dom);;
var option = null;
var emphasisAreaColor="#2a333d";         //选中省份的颜色
var areaColor="#323c48";              //省份的颜色
var borderColor="#aaa";                     //省份边界颜色
var selectedPro= "Beijing";  	//图中选中的省份名，默认是北京
//地图选中省份，  选中的省份,初始化的时候是空.当点击省份时，更新这个数据。.
// 默认是北京.最多只能选一个省份
var  geoData=[
    {name:"Beijing",selected:true }
    ,{name:"北京",selected:true }
];
var curIndex=0;             //滚动轴当前项,默认是第一个
var seriesData =[];         //  容器，存储 数据
var unit='';  //单位
var nameMap={  //地图省份名字映射关系
		'南海诸岛':"NanHai",
		'河南': "Henan",'山西': "Shanxi",
		'安徽': "Anhui",		'北京': "Beijing",		'甘肃': "Gansu",		'重庆': "Chongqing",
		'福建': "Fujian",		'广东': "Guangdong",		'广西': "Guangxi",		'贵州': "Guizhou",
		'黑龙江': "Heilongjiang",		'香港': "Hong Kong",		'湖北': "Hubei",
		'湖南': "Hunan",		'江苏': "Jiangsu",		'辽宁': "Liaoning",
		'江西': "Jiangxi",		'吉林': "Jilin",		'海南': "Hainan",
		'澳门': "Macau",		'内蒙古': "Inner mongolia",		'宁夏': "Ningxia",
		'青海': "Qinghai",		'河北': "Hebei",		'陕西': "Shaanxi",		'山东': "Shandong",
		'四川': "Sichuan",		'台湾': "Taiwan",		'天津': "Tianjin",		'西藏': "Tibet",
		'新疆': "Xinjiang",		'云南': "Yunnan",		'上海': "Shanghai",				'浙江': "Zhejiang"	,

	 	"Henan":"河南","Shanxi":"山西","Anhui":"安徽","Beijing":"北京","Gansu":"甘肃","Chongqing":"重庆",
		"Fujian":"福建","Guangdong":"广东","Guangxi":"广西","Guizhou":"贵州","Heilongjiang":"黑龙江",
		"Hong Kong":"香港","Hubei":"湖北","Hunan":"湖南","Jiangsu":"江苏","Liaoning":"辽宁","Jiangxi":"江西",
		"Jilin":"吉林","Hainan":"海南","Macau":"澳门","Inner mongolia":"内蒙古","Ningxia":"宁夏","Qinghai":"青海",
		"Hebei":"河北","Shaanxi":"陕西","Shandong":"山东","Sichuan":"四川","Taiwan":"台湾","Tianjin":"天津",
		"Tibet":"西藏","Xinjiang":"新疆","Yunnan":"云南","Shanghai":"上海","Zhejiang":"浙江"
	};

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
    //generateLineSeries();               //生成线数据
    //generateMapDate();              //生成地图上 省份的选中数据，
    option={
        baseOption:{
            backgroundColor:backgroundColor,				//背景
            /*  时间轴 */
            timeline:{
                axisType: 'category',   //类目轴，适用于离散的类目数据。
                orient: 'horizontal',   //水平放置
                autoPlay: false,
                inverse: false,
                playInterval: switchTime,//播放的速度（跳动的间隔），单位毫秒（ms）
                left: "10%",
                right: "10%",
                bottom: "3%",
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
                },
                data: []
            },
            /*地图*/
            geo:{
                show: true,
                zlevel :1,
                map: 'china',
                //selectedMode: 'single',//'single'表示单选，或者'multiple'表示多选
                roam: true, //允许缩放和平移
                selected: true,
                selectedMode:"single",
                nameMap: nameMap,  //省份显示英文
                zoom: 1.2,//当前视角的缩放比例。
                scaleLimit: {//滚轮缩放的极限控制，通过min, max最小和最大的缩放值
                    min: 0.8,
                    max: 2
                },
                itemStyle: {
                    normal: {
                        areaColor: areaColor,//地图区域的颜色。
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor:emphasisAreaColor    //选中省份时，背景色
                    }
                },
                label: {   // 国家名 标签
                    position: 'left',
                    show: false,
                    normal: {
                        show: false
                    },
                    emphasis: {         //选中国家的颜色
                        fontFamily: "Times New Roman",//字体
                        color: geoTextColor,
                        fontSize :14,
                        show: true
                    }
                }
            },
            /*线*/
            series:[
                {
                    type:"lines"
                }
            ],
            /*标题*/
            title:[
                {
					text: selectedRow.fileName,
                    subtext:  ' Unit: '+selectedRow.unit,				//副标题
					left: 'center',
					top: 10,
					textStyle: {
						fontFamily:"Times New Roman",	//字体
						color: textColor,
						fontWeight: 'normal',
						fontSize: 20
					},
					subtextStyle : {  						//副标题
						fontFamily:"Times New Roman",	//字体
						color: textColor
					},
				}
            ],
            /*提示框*/
            animationEasingUpdate: 'quinticInOut',
            animationDurationUpdate: switchTime			//数据更新动画的时长。
        },
        options:[ ]
    }

    /*生成线数据*/
    for(var n=0;n<selectedRow.timeline.length;n++){
        option.baseOption.timeline.data.push(selectedRow.timeline[n]);//时间轴
        /*生成线数据 */
        /*选中的省份 selectedPro */
        //var selectedProvince =selectedPro;
        option.options.push({
            series:[
                /* 线  +  箭头*/
                {
                    name: selectedPro+"_line"  ,
                    type: 'lines',
                    zlevel: 2,
				    symbol: ['none', 'arrow'],
                    symbolSize :14,
                    data: convertData(n)  //生成线的坐标关系
                },
                /*生成国家名，以及圆圈效果*/
                {
                    name:selectedPro+"_effectScatter",
                    type:"effectScatter",
                    coordinateSystem: 'geo',
                    zlevel: 3,
                    data:convertData2(n)
                }
            ]
        })
    }
    console.log(option);
    myChart.setOption(option,true);
    /*绑定省份点击事件*/
    myChart.on("click",function(params){
        if("geo"!=params.componentType){  //如果点击的不是地图的省份，那么跳过，不处理
			return;
		}
		var name =  params.region.name;  //省份名  英文名
		//var name =  nameMap[CNname];  //省份名  英文名
        if("Hong Kong,Macau,Taiwan,香港,澳门,台湾".indexOf(name)!=-1 || name ==undefined){  //有几个省份是忽略的
			myChart.setOption(option,true);
			return;
		}
		selectedPro = name;/*更新选中的省份*/
        option.options=[];
        for(var n=0;n<selectedRow.timeline.length;n++){
            option.options.push({
                series:[
                    /* 线  +  箭头*/
                    {
                        name: selectedPro+"_line"  ,
                        type: 'lines',
                        zlevel: 2,
                        symbol: ['none', 'arrow'],
                        symbolSize :14,
                        data: convertData(n)  ,//生成线的坐标关系,
                    },
                    /*生成国家名，以及圆圈效果*/
                    {
                        name:selectedPro+"_effectScatter",
                        type:"effectScatter",
                        coordinateSystem: 'geo',
                        zlevel: 3,
                        data:convertData2(n)
                    }
                ]
            })
        }
         myChart.setOption(option,true);
    })
}

/*进口，起点的10个坐标*/
var importCoordinatePoint = [
    {"longitude":73,"latitude":51,"color":"#ffa022"},
    {"longitude":73,"latitude":48,"color":"#EE82EE"},
    {"longitude":73,"latitude":45,"color":"#7CFC00"},
    {"longitude":73,"latitude":42,"color":"#43CD80"},
    {"longitude":73,"latitude":39,"color":"#46bee9"},
    {"longitude":73,"latitude":36,"color":"#CDCD00"},
    {"longitude":73,"latitude":33,"color":"#FF3030"},
    {"longitude":73,"latitude":30,"color":"#1BB116"},
    {"longitude":73,"latitude":27,"color":"#33a5c6"},
    {"longitude":73,"latitude":24,"color":"#a6c84c"}
]
/*出口，终点的10个坐标*/
var exportCoordinatePoint = [
    {"longitude":136,"latitude":51,"color":"#a6c84c"},
    {"longitude":136,"latitude":48,"color":"#ffa022"},
    {"longitude":136,"latitude":45,"color":"#EE82EE"},
    {"longitude":136,"latitude":42,"color":"#7CFC00"},
    {"longitude":136,"latitude":39,"color":"#43CD80"},
    {"longitude":136,"latitude":36,"color":"#46bee9"},
    {"longitude":136,"latitude":33,"color":"#CDCD00"},
    {"longitude":136,"latitude":30,"color":"#FF3030"},
    {"longitude":136,"latitude":27,"color":"#1BB116"},
    {"longitude":136,"latitude":24,"color":"#33a5c6"}
]

/*
*   生成带有涟漪特效动画的散点（气泡）图
*   params ： n(当前timeline的序号)
* */
var convertData2 = function(n){
    var res = [];
    var proData = selectedRow.series[selectedPro][n];   //当前时间轴节点下，所选中省份对应的10个进口数据和10个出口数据
    /*前10个是进口数据的国家*/
    for(var i=0;i<10;i++){
        var  countryInfo =proData.data[i]; //第i个国家的数据
        //   countryInfo.name;   //国家名
        //   countryInfo.value;  //进口或出口数据
        //   countryInfo.isBr;   //是否是BR国家
        res.push({
            name:countryInfo.name,
            value:[
                importCoordinatePoint[i].longitude,
                importCoordinatePoint[i].latitude,
                countryInfo.value
            ],
            label:{								// 文本标签,可用于说明图形的一些数据信息
                normal: {
                    show: true,
                    fontFamily : "Times New Roman" ,  //字体
                    position: 'right',      			//标签的位置。
                    distance :10,
                    formatter: function(params){
                        var name  = params.data.name;
                        var val  = params.data.value;
                        return name  + ":"+val[2].toFixed(3)
                    },
                    fontSize:15,
                    color:importCoordinatePoint[i].color
                }
            },
            itemStyle :{ // 散点图的颜色
                normal:{
                    color:importCoordinatePoint[i].color
                }
            }
        })
    }
    /* 后10个是出口数据的国家*/
    for(i=10;i<20;i++){
        var  countryInfo =proData.data[i]; //第i个国家的数据
        res.push({
            name:countryInfo.name,
            value:[
                exportCoordinatePoint[i-10].longitude,
                exportCoordinatePoint[i-10].latitude,
                countryInfo.value
            ],
            label:{								// 文本标签,可用于说明图形的一些数据信息
                normal: {
                    show: true,
                    fontFamily : "Times New Roman" ,  //字体
                    position: 'left',      			//标签的位置。
                    distance :10,
                    formatter: function(params){
                        var name  = params.data.name;
                        var val  = params.data.value;
                        return name  + ":"+val[2].toFixed(3)
                    },
                    fontSize:15,
                    color:exportCoordinatePoint[i-10].color
                }
            },
            itemStyle :{ // 散点图的颜色
                normal:{
                    color:exportCoordinatePoint[i-10].color
                }
            }
        })
    }
    return res;
}


/*
* 根据时间轴和选中的省份来生成线，
* 包括进口的线和出口的线
* params ： n(当前timeline的序号)
* */
var convertData = function(n){
    var res=[];
    var proData = selectedRow.series[selectedPro][n];   //当前时间轴节点下，所选中省份对应的10个进口数据和10个出口数据
    /* 选中的省份 ： selectedPro  */
    var proLatitude=selectedRow.proInfoList[selectedPro].latitude  //选中的省份纬度
    var proLongitude=selectedRow.proInfoList[selectedPro].longitude//选中的省份经度
    /*前10个是进口数据*/
    for(var i=0; i<10 ;i++){
        var data = selectedRow.series[selectedPro][n].data[i] ;
        var value = data.value ;
        var isBr = data.isBr ;
        var name = data.name ;
        var fromCoord=[importCoordinatePoint[i].longitude,importCoordinatePoint[i].latitude]
        var toCoord=[ proLongitude, proLatitude];
        res.push({
            sort:i,  //排序数据
            name:name+"_"+i,
            coords: [fromCoord, toCoord],
            value:value,
            lineStyle:{
                normal:{
                    color: importCoordinatePoint[i].color,
                    width:3,  //线宽
                    type:"solid",
                    opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                    curveness:0    //线的弯曲程度
                }
            }
        })
    }
    /*后10个是出口数据*/
    for(var i=10; i<20 ;i++){
        var data = selectedRow.series[selectedPro][n].data[i] ;
        var value = data.value ;
        var isBr = data.isBr ;
        var name = data.name ;
        var toCoord=[exportCoordinatePoint[i-10].longitude,exportCoordinatePoint[i-10].latitude]
        var fromCoord=[ proLongitude, proLatitude];
        res.push({
            sort:i,  //排序数据
            coords: [fromCoord, toCoord],
            value:value,
            lineStyle:{
                normal:{
                    color: exportCoordinatePoint[i-10].color,
                    width:3,  //线宽
                    opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                    curveness:0    //线的弯曲程度
                }

            }
        })
    }

    return res;

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
	$('#tableContainer').bootstrapTable('destroy');//先销毁表格
    $('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			selectedPro="Beijing";        //选中的省份,改为默认省份
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

/*/!*初始化中国地图*!/
var initEchart = function(row){
     console.log("初始化中国地图echarts！");
     if(myChart&&myChart.dispose){
        myChart.dispose();
    }
    curIndex=0;                 //初始化
    dom = document.getElementById("mapContainer");
    myChart = echarts.init(dom);

}*/
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
        emphasisAreaColor="#2a333d";
        areaColor="#323c48";
        textEmphasisColor="#fff";
        borderColor="#aaa";
        initEchart(selectedRow);
    })

    $("#white_li").bind("click",function() {  //切换成白色背景
        backgroundColor="#C1C1C1";
        textColor='#444444';
        emphasisColor='#555555';
        visualMapColorOutOfRange='#B1B1B1';
        emphasisAreaColor="#C1C1C1";
        areaColor="#DCDCDC";
        textEmphasisColor="#000000";
        borderColor="#555555";
        initEchart(selectedRow);
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap7",refBtnFn);
    })

}
