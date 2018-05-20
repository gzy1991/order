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
var emphasisAreaColor="#fff";         //选中省份的颜色
var areaColor="#404a59";              //省份的颜色
var borderColor="#aaa";                     //省份边界颜色
var selectedPros= "Beijing";  	//图中选中的省份名，默认是北京
//地图选中省份，  选中的省份,初始化的时候是空.当点击省份时，更新这个数据。.
// 默认是北京.最多只能选一个省份
var  geoData=[
    {name:"Beijing",selected:true }
    ,{name:"北京",selected:true }
];

/*世界地图*/
var dom2= document.getElementById("mapContainer2");;//
var myChart2 = echarts.init(dom2);;
var option2 = null;
var seriesData =[]; //  容器，存储数据
var curIndex=0;             //滚动轴当前项,默认是第一个
var  geoData2=[              //世界地图，颜色
    {
        name:"China",
        selected:true,
        itemStyle:{
            color:'#cc484a',
            areaColor :{
                color:'#cc484a'
            }
        },
        emphasis:{
            itemStyle:{
                 color:'#cc484a'
            }
        }
    }
];
/*生成世界地图中，各国的颜色数据*/
/* 根据 selectedPros 和 curIndex ，生成geoData2  */
var generateColor=function(){
    geoData2=[];//先清空
    for(var i=0;i<189;i++){

    }

}

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
			seriesData=[];          //
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
            nameMap: nameMap,  //省份显示英文
            selected:true,//?
            zoom:1.2,
            scaleLimit:{//滚轮缩放的极限控制，通过min, max最小和最大的缩放值
                min:0.8,
                max:2
            },
            regions:geoData,

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

    /*绑定身份点击事件*/
    myChart.on('click', function (params) {
        if("geo"!=params.componentType){  //如果点击的不是地图的省份，那么跳过，不处理
            return;
        }
        var name =  params.region.name;  //省份名  英文名
        if("Hong Kong,Macau,Taiwan,香港,澳门,台湾".indexOf(name)!=-1 || name ==undefined){  //有几个省份是忽略的
		}else{
            selectedPros=name;
            geoData=[
                {name:name, selected:true  }
                ,
                {name:nameMap[name], selected:true }
                ];
            option.geo.regions=geoData;
        }
        //var isSelected=selectedPros.indexOf(name) != -1; //省份是否已经被选中了，
        /*更新选中的省份*/
        myChart.setOption(option,true);
    })


}


/*初始化世界地图*/
var initEchart2= function(row){
    console.log("初始化世界地图echarts！");

    if(myChart2&&myChart2.dispose){
        myChart2.dispose();
    }
    unit=row.unit;
    dom2 = document.getElementById("mapContainer2");
    myChart2 = echarts.init(dom2);
    option2={
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
                    normal: {           //轴效果
                        textStyle: {
                            fontFamily:"Times New Roman",	//字体
                            color: textColor
                        }
                    },
                    emphasis: {         //轴点击时效果
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

            animationDurationUpdate: switchTime			//数据更新动画的时长。
        },
        options: [
        ]

    };
     for(var n=0;n<row.timeline.length;n++){
    	option2.baseOption.timeline.data.push(row.timeline[n]);
    	option2.options.push({
            geo: {              //世界地图
                show:true,
                name: 'maps2',
                type: 'map',
                map: 'world',
                aspectScale :1,//用于 scale 地图的长宽比。
                roam: true,
                silent:false,            //不响应鼠标点击事件
                selectedMode:'false',      //只能选一个
                //selected:true,//?
                zoom:1.2,
                scaleLimit:{//滚轮缩放的极限控制，通过min, max最小和最大的缩放值
                    min:0.8,
                    max:2
                },
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
                },
                regions:geoData2  //地图颜色信息
            },
        })

	}
    myChart2.setOption(option2,true);
    myChart2.on('click', function (params) {
        console.log(params)

    })

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


    //切换背景色 :  黑色，白色  ，默认黑色
    $("#black_li").bind("click",function() {  //切换成黑色背景
        backgroundColor="#404a59";
        textColor='#ccc';
        emphasisColor='#aaa';
        visualMapColorOutOfRange='#4c5665';
        visualMapColor=["#33a5c6",
            "#1BB116",
            "#c67f58"];
        emphasisAreaColor="#fff";
        areaColor="#404a59";
        textEmphasisColor="#fff";
        borderColor="#aaa";
        initEchart(selectedRow);
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
        initEchart2(selectedRow);//初始化小地图
    })
    /*删除按钮*/
    $("#delBtn").bind("click",function(){
        delBtnFn("tableContainer","deleteResult","deleteModel","/deleteDataInMap3",initData());
    })

}




