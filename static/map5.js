/**
 * Created by gzy on 2018/8/11.
 *
 */


/*背景切换所需的数据*/
var backgroundColor ='#404a59';     //echart背景色
var textColor='#ccc';                   //文字颜色
var areaColor ='#404a59'; //地图区域的颜色
var emphasisAreaColor='#2a333d';   //选中国家时，背景色
var lineColor ="#FF3030";					//线和线上标签的颜色
var geoTextColor="#fff";            //地图上，选中国家时，国家名的颜色


/*显示类型，，all:显示全部国家   ，sub:显示63个BR国家  */
var countryType="sub";

/*全局数据*/
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var widewsPercentage=[30,30];       //窗体左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。
var isShowSign=true;  	//是否显示标签 ，默认显示

//滚动轴 数据
var switchTime =2000;       //动画切换时间 2秒

/*雷达图*/
var dom = document.getElementById("mapContainer");;//
var myChart = echarts.init(dom);;
var option=null;
var radarData1=[];  //雷达图1的数据
var radarData2=[];  //雷达图2的数据

/*世界地图*/
var dom2= document.getElementById("mapContainer2");;//
var myChart2 ;
var option2 ;
var seriesData =[]; //  容器，存储数据
var selectedCountrys= [];  	//图中选中的国家名集合,存储的是echarts中的国家名
var geoData=[]        ;     //选中的国家
var lines=[] ;                 //线数据  ，数据容器
var borderColor="#aaa";                     //省份边界颜色


//提示框配置数据
var itemStyle = {
    opacity: 0.7,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)'
};

//获取页面表格数据
var initPageData=function(){
	$.ajax({
        type:"GET",
        async:false,
        url:"/initMap5",
        success:function (data) {
	        console.log(" initMap4 扫描成功");
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
			seriesData=[];          //
			selectedRow=row;
            initEchart(selectedRow);    //初始化雷达图
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

		initEchart2(selectedRow);   //初始化世界地图
        initEchart();    //初始化雷达图
	}
	$('#loading').modal('hide');
}

/*初始化雷达图
* 当前的地图上，可能没有选中国家，可能只选择了一个国家，或者选中了两个国家
*  如果只选中了一个，那么只初始化第一个雷达图，
*  如果选中了两个，那么初始化两个雷达图
* */
var initEchart = function(){
    console.log("初始化雷达图echarts!");
    if(myChart&&myChart.dispose){
        myChart.dispose();
    }
    dom = document.getElementById("mapContainer");
    myChart = echarts.init(dom);
    var curCountrys=selectedCountrys.length;  //当前已选中的国家个数
    /*生成 indicator 指标数据 */
    var indicatorData=[];
    selectedRow["sheetMax"].forEach(function(item,i){  /*生成 indicator指标 */
        var max=selectedRow["sheetMax"][i]  - selectedRow["sheetMaxSource"][i] >0 ? selectedRow["sheetMax"][i] : selectedRow["sheetMaxSource"][i];
        max=parseInt(max);
        indicatorData.push({
            text:selectedRow["middleNameList"][i],      // 名字
            max:max       //这个指标的最大值
        })
    })
     /* 根据国家个数，生成两个雷达图所需的数据 */
    radarData1=[]; //先清空雷达数据
    radarData2=[];
    var original=selectedRow["original"];   //原始数据

    if(curCountrys == 0){
        //不处理，此时就是空数据
    }else if(curCountrys ==1 ){
        var country_1=selectedCountrys[0];      //第一个国家的名字
        var index = selectedRow["countryInfo"][country_1]["sort"]  //第一个国家的序号
        var oringinalData=original[index]           //第一个国家的原始数据
        var tempData=[];
        oringinalData.forEach(function(item,i){
            tempData.push(item);
        })
        radarData1.push({           //第一个雷达图的 原始数据
            value:tempData,
            symbol: 'rect',     //单个数据标记的图形。
            symbolSize: 5,      //单个数据标记的大小
            lineStyle: {
                color:"#1ed1ac",
                normal: {
                    type: 'dashed'
                }
            }
        });
    }else {
        var country_1=selectedCountrys[0];
        var country_2=selectedCountrys[1];
        var index1 = selectedRow["countryInfo"][country_1]["sort"]  //第一个国家的序号
        var index2 = selectedRow["countryInfo"][country_2]["sort"]  //第二个国家的序号
        var oringinalData1=original[index1]                             //第一个国家的原始数据
        var oringinalData2=original[index2]                             //第二个国家的原始数据
        var middleNameList = selectedRow["middleNameList"]          //中间数据sheet名
        var originalData1=[];        //第一个雷达图的 原始数据
        var middleData1=[];          //第一个雷达图的原始数据+ 中间数据
        var originalData2=[];        //第二个雷达图的 原始数据
        var middleData2=[];          //第二个雷达图的原始数据-中间数据
        oringinalData1.forEach(function(item,i){//处理第一个雷达图的数据
            originalData1.push(item);
            //var sheetName = middleNameList[i];
            var sheetData = selectedRow["middle"][i];
            middleData1.push(item -  sheetData[index1][index2])//
        })
        oringinalData2.forEach(function(item,i){//处理第二个雷达图的数据
            originalData2.push(item);
            var sheetData = selectedRow["middle"][i];
            middleData2.push(item + sheetData[index1][index2]) //
        })

        radarData1.push({           //第一个雷达图的 原始数据
            value:originalData1,
            symbol: 'rect',     //单个数据标记的图形。
            symbolSize: 5,      //单个数据标记的大小
            lineStyle: {
                normal: {
                    type: 'dashed'
                }
            }
            },{ //第一个雷达图的原始数据+中间数据
                value:middleData1,
                areaStyle: {
                        normal: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                }
            }
        );
        radarData2.push({           //第二个雷达图的 原始数据
            value:originalData2,
            symbol: 'rect',     //单个数据标记的图形。
            symbolSize: 5,      //单个数据标记的大小
            lineStyle: {
                normal: {
                    type: 'dashed'
                }
            }
            },{                 //第二个雷达图的原始数据 - 中间数据
                value:middleData2,
                areaStyle: {
                        normal: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                }
            }
        );

    }
    option={
        title: {
            text: '雷达图'
        },
        radar:[
            {
                id:"1",
                indicator:indicatorData, //雷达图的指示器，用来指定雷达图中的多个变量（维度）
                center: ['25%', '50%'],             //圆心位置，
                radius: '45%',                        //半径
                startAngle: 90,           //坐标系起始角度，也就是第一个指示器轴的角度
                splitNumber: 4,           // 指示器轴的分割段数，默认是5
                shape: 'circle',          //雷达图绘制类型，支持 'polygon' 和 'circle'
                name: {                     //雷达图每个指示器名称的配置项
                    formatter:'【{value}】',
                    textStyle: {
                        color:'#72ACD1'
                    }
                },
                splitArea: {                //坐标轴在 grid 区域中的分隔区域，默认不显示
                    areaStyle: {
                        color: ['rgba(114, 172, 209, 0.2)',
                        'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                        'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 10
                    }
                },
                axisLine: {                 //坐标轴轴线相关设置
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                splitLine: {                //坐标轴在 grid 区域中的分隔线
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            },
            {
                id:"2",
                indicator:indicatorData, //雷达图的指示器，用来指定雷达图中的多个变量（维度）
                center: ['75%', '50%'],             //圆心位置，
                radius:'50%',                        //半径
                startAngle: 90,           //坐标系起始角度，也就是第一个指示器轴的角度
                splitNumber: 4,           // 指示器轴的分割段数，默认是5
                shape: 'circle',          //雷达图绘制类型，支持 'polygon' 和 'circle'
                name: {                     //雷达图每个指示器名称的配置项
                    formatter:'【{value}】',
                    textStyle: {
                        color:'#72ACD1'
                    }
                },
                splitArea: {                //坐标轴在 grid 区域中的分隔区域，默认不显示
                    areaStyle: {
                        color: ['rgba(114, 172, 209, 0.2)',
                        'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                        'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 10
                    }
                },
                axisLine: {                 //坐标轴轴线相关设置
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                splitLine: {                //坐标轴在 grid 区域中的分隔线
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        ],

        series:[
            {
                name:"雷达图1",
                type: 'radar',
                itemStyle: {            //折线拐点标志的样式。
                    emphasis: {
                        // color: 各异,
                        lineStyle: {
                            width: 4
                        }
                    },
                },
                data:radarData1     //雷达图的数据是多变量（维度）的
            },{
                name:"雷达图1",
                type: 'radar',
                radarIndex:1,
                itemStyle: {            //折线拐点标志的样式。
                    emphasis: {
                        // color: 各异,
                        lineStyle: {
                            width: 4
                        }
                    },
                },
                data:radarData2     //雷达图的数据是多变量（维度）的
             }
        ]
    }
    myChart.setOption(option,true);
}

/*  获取到雷达图所需的数据  */


/*初始化世界地图*/
var initEchart2= function(row){
    console.log("初始化世界地图echarts!");
    if(myChart2&&myChart2.dispose){
        myChart2.dispose();
    }
    dom2 = document.getElementById("mapContainer2");
    myChart2 = echarts.init(dom2);
    option2= {
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        backgroundColor: backgroundColor,
        title: {
            text: row.fileName,
            left: 'center',
            subtextStyle: {		//副标题
                fontFamily: "Times New Roman",//字体
                color: textColor
            },
            textStyle: {
                fontFamily: "Times New Roman",//字体
                color: textColor
            }
        },
        //地图
        geo: {
            show: true,
            map: 'world',
            selectedMode: 'multiple',
            roam: true, //允许缩放和平移
            selected: false,
            zoom: 1.2,
            scaleLimit: {//滚轮缩放的极限控制，通过min, max最小和最大的缩放值
                min: 0.8,
                max: 2
            },
            itemStyle: {
                normal: {
                    areaColor: areaColor,//地图区域的颜色
                    borderColor: borderColor
                },
                emphasis: {
                    areaColor: emphasisAreaColor    //选中省份时，背景色
                }
            },
            label: {   //标签
                position: 'left',
                show: false,
                normal: {
                    show: false
                },
                emphasis: {
                    fontFamily: "Times New Roman",//字体
                    color: geoTextColor,
                    show: false
                }
            },
            regions: geoData
        },
        series: seriesData
    }
    ;
    myChart2.setOption(option2, true);
    //绑定国家的点击事件
    myChart2.on("click",function(params){
        if("geo"!=params.componentType){  //如果点击的不是地图的省份，那么跳过，不处理
			return;
		}
		var name =  params.region.name;  //国家名  英文名
        /*关于BR地区的判定 todo */

        var isSelected=selectedCountrys.indexOf(name) != -1; //点击的国家，是否已经被选中了，
        if(isSelected){//如果已选择当前国家,那么把这个国家删除

        }else{

        }
        seriesData=[];      //先清空之前的线
        geoData=[];         //清空选中的国家
        var curCountryNum = selectedCountrys.length;//目前已选中的国家个数
        if(curCountryNum == 0){//已经选中了0个国家
            selectedCountrys.push(name);
        }else if (curCountryNum == 1){//已经选中了1个国家
            if(isSelected){         //如果是重复点击1个国家, 那么删除这个国家
                selectedCountrys.splice(selectedCountrys.indexOf(name),1);//
            }else{                  //添加这个国家
                selectedCountrys.push(name);
                generateSeries();  //这时候，需要生成series线数据, 用来划线
            }
        }else{//已经选中了两个国家，
            if(isSelected){ //，删除这个国家
                selectedCountrys.splice(selectedCountrys.indexOf(name),1);
            }else{//先删除之前的两个国家,再把这个国家加上去
                selectedCountrys.pop();
                selectedCountrys.pop();
                selectedCountrys.push(name);
            }
        }
        /*选中国家*/
        selectedCountrys.forEach(function(item,i){
            geoData.push({name: selectedCountrys[i] ,selected:true});
        })
        option2.geo.regions=geoData;
        option2.series=seriesData;
        myChart2.setOption(option2,true);
        initEchart();//更新雷达图
    })
}

/* 根据当前选中的国家，生成线数据series */
var generateSeries=function(){
    if(selectedCountrys.length!=2){
        return;
    }
    seriesData=[];
    seriesData.push({   //选中的国家的名字，以及圆圈动画效果
        name:selectedCountrys[0]+"_"+selectedCountrys[1]+"_line",
            type:"lines",
            zlevel: 2,
            symbol: ['none', 'arrow'],
            lineStyle: {
                normal: {
                    color: lineColor,
                    opacity: 0.6,    						//图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                    curveness: 0.4                          //边的曲度,支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
                }
            },
            data:convertData()  //坐标关系
    });
}

/*生成线的 坐标关系
*
* */
var convertData = function(){
    var res = [];//容器
    var coun1 =selectedCountrys[0];//第一个国家名，Echarts中的国家名
    coun1 = selectedRow["countryInfo"][coun1]["SourceName"]//第一个国家名，对应的原始姓名，可能一样，也可能不一样，countrytInfo中存储的是原始姓名
    var coun2 =selectedCountrys[1];//第二个国家名
    coun2=selectedRow["countryInfo"][coun2]["SourceName"]
    var fromCoord = [countrytInfo[coun1]["longitude"],  countrytInfo[coun1]["latitude"]];
    var toCoord = [countrytInfo[coun2]["longitude"],  countrytInfo[coun2]["latitude"]];
    if(fromCoord && toCoord){
        res.push({
            fromName:coun1,
            toName: coun2,
            coords: [fromCoord, toCoord],
            symbolSize :15, //箭头大小
            lineStyle:{
                normal:{
                    width: 2.5,   //线宽
                    //width: 8-dataItem.sort*1.4,   //线宽
                    opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                    curveness: 0
                }
            }
        });

    }
    return res;
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

    /*显示全部国家*/
    $("#all_li").bind("click",function() {
        countryType="all";
        initEchart2(selectedRow);//
    })

     /*显示BR国家*/
    $("#sub_li").bind("click",function() {
        countryType="sub";
        initEchart2(selectedRow);//
    })

    /*切换背景色 :  黑色，白色  ，默认黑色*/
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

        initEchart(selectedRow);
        initEchart2(selectedRow);//
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap5",refBtnFn);
    })



}










