
/**
 * Created  on 2018/9/06.
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
var countryType="BR";

/*全局数据*/
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var widewsPercentage=[35,35];       //窗体左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。

/*世界地图*/
var dom= document.getElementById("mapContainer");;//
var myChart ;
var option ;
var lineNumOfLevel = 3 ;// 每层level，每个国家新画的线的条数
var seriesData =[]; //  容器，存储线数据
/*  selectedCountrys 结构
* {
*   name:,
*   level:,   //最小是0，最大是n，即sheet的个数-1 ,selectedRow["level"]
*   isHandle:   //是否已经处理过
* }
* */
var selectedCountrys= [];  	//图中选中的国家名集合,存储的是echarts中的国家名,本图中，最多只能选中一个国家
var geoData=[]        ;     //选中的国家
var lines=[] ;                 //线数据  ，数据容器
var borderColor="#aaa";                     //省份边界颜色
var lineColor=[     //不同层，线的颜色不一样
    "#ffa022",
    "#EE82EE",
    "#7CFC00",
    "#43CD80",
    "#46bee9",
    "#CDCD00"
]

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
    selectedRow.curLevel=0;//当前所在层级,默认是0，这个属性，主要用在前台的逻辑控制
    seriesData=[];                  //清空线数据
    generateLineSeries();               //生成线数据
    generateMapDate();              //生成地图上 国家的选中数据，和BR国家的颜色数据
    option= {
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        backgroundColor: backgroundColor,
        title: {
            text: selectedRow.fileName,
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
        /*自定义按钮*/
        toolbox: {
            zlevel :3,
            left:'5%',
            bottom:'5%',
            itemSize :35,//工具栏 icon 的大小。
            iconStyle :{
                color:geoTextColor,
            },
            itemGap :15,//工具栏 icon 每项之间的间隔
            feature: {
                mytool1: {
                    show: true,
                    title: '下一层',
                    icon: 'path://M832 160.128c0-17.664-14.336-32-32-32S768 142.464 768 160.128l0 282.88L214.592 134.592c-18.176-10.112-39.936-10.048-58.112 0C138.24 144.768 127.424 162.88 127.424 183.168l0 656.64c0 20.224 10.816 38.464 29.056 48.576C165.568 893.44 175.488 896 185.472 896s19.968-2.56 29.056-7.616L768 579.968l0 284.096c0 17.664 14.336 32 32 32s32-14.336 32-32L832 160.128zM191.808 829.248 188.672 192l573.312 319.488L191.808 829.248z',
                    onclick: function (){
                        alert('下一层');
                    }
                },
                mytool2: {
                    show: true,
                    title: '刷新',
                    icon: 'path://M911.40249 607.60166c-21.244813-4.248963-46.738589 8.497925-50.987552 29.742738-42.489627 174.207469-195.452282 293.178423-373.908714 293.178424-212.448133 0-386.655602-174.207469-386.655602-386.655602s174.207469-386.655602 386.655602-386.655602c97.726141 0 195.452282 38.240664 263.435685 106.224067h-178.456432c-21.244813 0-42.489627 16.995851-42.489626 42.489626 0 21.244813 16.995851 42.489627 42.489626 42.489627h263.435685c21.244813 0 42.489627-16.995851 42.489626-42.489627v-263.435684c0-21.244813-16.995851-42.489627-42.489626-42.489627-21.244813 0-42.489627 16.995851-42.489627 42.489627v148.713693c-84.979253-76.481328-195.452282-118.970954-310.174274-118.970955-259.186722 0-471.634855 212.448133-471.634854 471.634855s212.448133 471.634855 471.634854 471.634855c216.697095 0 403.651452-148.713693 458.887967-356.912863 4.248963-21.244813-8.497925-42.489627-29.742738-50.987552z',
                    onclick: function (){
                        alert('刷新');
                    }
                }
            }
    },
        //地图
        geo: {
            show: true,
            zlevel :1,
            map: 'world',
            selectedMode: 'single',
            roam: true, //允许缩放和平移
            selected: true,
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
            },
            regions: geoData  //地图上，国家的选中数据，BR国家的颜色数据
        },
        series: seriesData  //线数据
    }
    ;
    myChart.setOption(option, true);
    // //绑定国家的点击事件
    myChart.on("click",function(params){
        if(params.componentType!="geo"){return} //点击了线，那么跳过
        var name =  params.region.name;  //国家名  英文名
        if(selectedRow["countryList"].indexOf(name)==-1){//如果点击的国家不是那189个国家之一，那么不处理
            return;
        }
        if(selectedCountrys.length>0 && selectedCountrys[0].name == name ){       //如果重复点击一个国家,那么清空
            selectedCountrys=[];     //清空选中国家
            seriesData=[];            //清空线数据
            //generateLineSeries();
            generateMapDate();          //生成BR国家效果
            option.series=seriesData;
            option.geo.regions=geoData;
            myChart.setOption(option,true);
            return;
        }
        /*如果选中了其他国家*/
        //选中国家
        selectedCountrys=[{
            name:name,      //EchartName
            isHandle:false,
            level:0
        }];
        seriesData=[];          //清空线数据
        selectedRow.curLevel=0; //重置“当前等级”
        generateLineSeries();       //生成线
        generateMapDate();          //生成地图选中效果，和br国家效果
        option.series=seriesData;
        option.geo.regions=geoData;
        myChart.setOption(option,true);


    })
}

/*
*  根据目前选中的国家，生成线数据 series
*
* */
var generateLineSeries =function() {
    if (selectedCountrys.length == 0) {
        return;
    }
    var maxLevel = selectedRow["level"];
    /*最高等级，当前行数据，sheet的个数*/
    var curLevel = selectedRow.curLevel;
    /*当前的等级，curLevel最大是maxLevel-1，最小是0*/
    var len = selectedCountrys.length;
    if (curLevel == maxLevel - 1) {                         //如果已经最最大level，那么清空线和选中数据
        curLevel = 0
        selectedRow.curLevel = curLevel;
        seriesData=[];                                      /*清空线数据*/
        selectedCountrys=selectedCountrys.slice(0,1);   /*只保存第一个国家*/
        generateLineSeries();                                   /**/

    }else if ( curLevel < maxLevel  ) {                          /*  等级+1  */
        for (var i = 0; i < len; i++) {
            var item = selectedCountrys[i];                     /*处理这个国家*/
            if(!item.isHandle &&  item.level==curLevel ){
                /*待处理国家的信息*/
                var name=item.name;//名字
                var index = selectedRow.countryInfo[name].sort;     //待处理国家的索引号
                for (var j = 0; j < lineNumOfLevel; j++) {
                    var tIndex=selectedRow.middleDataSort[curLevel][index][j];          /*目标国家的索引号*/
                    var tName = selectedRow.countryList[tIndex]                         /*目标国家的名字 EchartName*/
                    tName=selectedRow.countryInfo[tName].EchartName                     /*目标国家的 EchartName 名字*/
                    /*记录选中国家*/
                    selectedCountrys.push({
                        name:tName,
                        level:curLevel+1,
                        isHandle:false
                    })
                    /*生成线*/
                    seriesData.push(
                        /* 线  +  箭头*/
                        {
                            name:name+"_"+tName+"_line",
                            type:"lines",
                            zlevel: 2,
                            symbol: ['none', 'arrow'],
                            effect: {              							//线特效，这里先不显示
                                show: false
                            },
                            lineStyle: {            						//对线的各种设置 ：颜色,形状,曲度
                                normal: {
                                    color: lineColor[curLevel % 6],                   //线的颜色，每一层一个颜色
                                    curveness: 0.2  						//边的曲度,支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
                                }
                            },
                            data:convertData(name,tName)
                        }
                        /*生成选中国家的名字，以及圆圈动画效果*/

                    )

                    /**/
                }
            }
        }
        curLevel =(curLevel +1);
        selectedRow.curLevel=curLevel;
    }
}

    /**生成线坐标
     * fName: 起始国家的EchartName
     * tNAme: 目标国家的EchartName
     */
var convertData = function(fName,tName){
    var res=[];
    //countrytInfo中既有SourceName的坐标数据 ，又有EchartName的坐标数据
    var fromCoord = [countrytInfo[fName]["longitude"],  countrytInfo[fName]["latitude"]];
    var toCoord = [countrytInfo[tName]["longitude"],  countrytInfo[tName]["latitude"]];
    if(fromCoord && toCoord){
        res.push({
            fromName:fName,
            toName: tName,
            coords: [fromCoord, toCoord],
            symbolSize :15, //箭头大小
            lineStyle:{
                normal:{
                    width: 2.5,   //线宽
                    opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                    curveness:  0.2 //边的曲度, 支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
                }
            }
        });
    }
    return res;

}

/*      生成全部地区或者BR地区的地图数据
*       主要是选中国家的数据 geoData
*       当类型是BR的时候，还要生成BR国家的特殊颜色数据
* */

var generateMapDate =function(){
    geoData=[];
    if("BR"!= countryType){     // 如果区域类型是全部国家
        selectedCountrys.forEach(function(item,i){
            geoData.push({name: selectedCountrys[i].name ,selected:true});
        })
    }else{                      // 如果区域类型是BR国家
        var counList=selectedRow["countryList"];//国家列表，有序
        var counInfo=selectedRow["countryInfo"];//国家详细信息
        counList.forEach(function(item,i){//遍历所有国家
            if(counInfo[item].isBrRegion){  //如果是BR地区
                var isSelected=false;
                /*只有第一个选中的国家才有选中效果*/
                if(selectedCountrys.length>0 && counInfo[item].EchartName == selectedCountrys[0].name ){
                    isSelected=true;
                }
                if(isSelected){ //如果选中了
                    geoData.push({
                        name: counInfo[item].EchartName,
                        selected :true,
                        itemStyle:{
                            areaColor :"#ff4143", //  BR国家，选中时候的颜色
                            opacity :0.5
                        }
                    })
                }else{//如果没选中
                    geoData.push({
                        name: counInfo[item].EchartName,
                        selected :false,
                        itemStyle:{
                            areaColor :BRCountryColor,//BR国家，没选中时的黑色背景：#ffbb2d
                            opacity :0.5
                        }
                    })
                }
            }
        })
    }
    /*处理选中国家 , 只有第一个选中的国家才有选中效果*/
    if(selectedCountrys.length>0  ){
        geoData.push({
             name: selectedCountrys[0].name,
             selected :true
        })
    }


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
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap6",refBtnFn);
    })
}
