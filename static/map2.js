/**
 * Created by  on 2018/1/19
 */

//全局变量

//背景切换所需的数据
var backgroundColor ='#404a59';  //echart背景色
var color=[]
var areaColor ='#fff'; //地图区域的颜色
var emphasisAreaColor='#FFFF00';   //选中省份时，背景色
var textColor='#fff';
var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();		//浏览器宽度
$("#tableDiv").height(browserHeight+"px");

var geoTextColor="#fff"; //地图上，选中国家时，国家名的颜色

//echart全局变量
var dom = document.getElementById("mapContainer");;
var myChart;
//var app = {};
var option = null;
var seriesData =[]; //
var unit='';  //单位
var tradeType="export" ; 	//进出口类型，进口import、出口export 或者全部all，默认是export
var backGroundType="white" ; //背景颜色类型，白色和黑色，默认是白色
var isShowSign=true;  	//是否显示标签 ，默认显示

var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedSheet;   		//table中选中的那一行 的行数据
var selectedPros= [];  	//图中选中的省份名集合
var lines ;  //线  ，数据容器
var nameMap={  //地图省份名字映射关系
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

var geoData=[ 			// 选中的省份,初始化的时候是空.点击省份时，更新这个数据
	//{name:'Guangdong', selected:true},
	//{name:'广东', selected:true},
	// {name:'陕西', selected:true},
	// {name:'云南',selected:true}
];

/* 初始化echart  ,第一次打开页面时或者点击表格行事件时，调用本函数
*  入参：表格的行数据  */
var initEchart = function(row){
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
	option = null;
	seriesData =[];  //初始化 series数据
	//selectedPros=[];

	option = {
	  	tooltip: {
	      	trigger: 'item',
	      	formatter: '{b}'
	  	},
		backgroundColor: backgroundColor,
		title : {
			text: row.fileName,
			subtext: 'Unit：'+unit,
			left: 'center',
			textStyle : {
				color: textColor
			}
		},
		//图
	  	geo: {
	      	show:true,
	      	map: 'china',
	      	label: {
	        	emphasis: {
	            show: false
	        	}
	      	},
	        selectedMode : 'multiple',
	        roam: true, //允许缩放和平移
		    selected:true,
		    nameMap: nameMap,  //省份显示英文
		    itemStyle: {
		        normal: {
		        	areaColor: areaColor,//地图区域的颜色。
					borderColor: '#404a59'
		        },
		        emphasis: {
		            areaColor:emphasisAreaColor    //选中国家时，国家背景色
		        }
	    	},
		    label: {
		      	position:'left',
		      	show:true,
		      	normal: {
		          show: true
		      	},
		      	emphasis: {
		          show: true
		      	}
    		},
	    	regions:geoData
	    }
		//series:seriesData
		//化线
	};

	myChart.setOption(option, true);

	//绑定省份的点击事件
	myChart.on('click', function (params) {
		if("geo"!=params.componentType){  //如果点击的不是地图的省份，那么跳过，不处理
			return;
		}
    	console.log('点击了'+params.name);
    	var name =  params.region.name;  //省份名  英文名
		if("Hong Kong,Macau,Taiwan,Tibet,香港,澳门,台湾,西藏".indexOf(name)!=-1){  //有几个省份是忽略的
			myChart.setOption(option,true);
			return;
		}
    	//var state = params.region.selected; //选中状态，是否被选中，true 是， false 否
		var isSelected=selectedPros.indexOf(name) != -1; //省份是否已经被选中了，
		if(!isSelected){  //如果之前未被选中，那么添加
			var index=selectedPros.indexOf(name);
			if(index == -1){
				selectedPros.push(name);
				//选中省份
				geoData.push({name: name ,selected:true});
				geoData.push({name: nameMap[name] ,selected:true});
				//划线
				generateSeries();  //生成series数据, 划线
				//option.series=seriesData;
				option.geo.regions=geoData;
			}
		}else if(isSelected){   //否则 ,删除
			var index=selectedPros.indexOf(name);
			if(index!== -1){
				selectedPros.splice(index,1);
				//取消选中
				var tempGeoData=[];
				geoData.forEach(function(item,i){
					if(item.name != name && item.name!=nameMap[name]){
						tempGeoData.push(item);
					}
				});
				geoData=tempGeoData;
				//划线
				generateSeries();  //生成series数据
				//option.series=seriesData;
				option.geo.regions=geoData;
			}
		}
		myChart.setOption(option,true);
    	console.log(selectedPros);
    	console.log(myChart.getOption());
	});
}

/* 根据当前选中的省份 和 进出口类型，生成series */
var generateSeries = function(){
	//  tradeType ; 贸易类型
	seriesData=[];  //先清空之前的线
	if(tradeType == "import"){
		generateLines("import");
	}else if (tradeType=="export"){
		generateLines("export");
	}else if (tradeType  =="all"){
		generateLines("import");
		generateLines("export");
	}
	option.series=seriesData;
}
/*生成线
*  type: import 或 export
* */
var generateLines = function(type ){
	//selectedSheet 当前选中的table行数据
	//selectedPros  当前选中的省份数据
	lines=[];
	if(selectedPros && selectedPros.length>0){
		selectedPros.forEach( function(province,i){  //遍历省份    province是英文名，
			var tradeData=[];
			if(type=="import"){
				tradeData = selectedSheet[province].importData  ;//进口
			}else if (type=="export"){
				tradeData = selectedSheet[province].exportData  ;//出口
			}
			if(tradeData && tradeData.length>0){  //遍历这个省份的出口或进口数据
				tradeData.forEach(function(item,j){
					seriesData.push({
						//  线  +  飞机
						name: province.chineseName+" "+item.sort+": "+item.chineseAbbrName  ,
						type: 'lines',
						zlevel: 2,
						symbol: ['none', 'arrow'],
						symbolSize: 10,
						effect: { //线特效  ，这里先不显示
							show: false,
							period: 6,
							trailLength: 0,
						},
						lineStyle: {
							normal: {
								color: '#FF3030',
								//width: 1,           					//线宽与数值有关
								opacity: 0.6,    						//图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
								//curveness: 0
							}
						},
						data: convertData(province,tradeData,type)  //坐标关系
					});
				});
			}
		})
	}
}

/*生成线的 坐标关系
*  province 选中的省份,英文名
*  tradeData： 这个省份的贸易数据  （出口前5或者进口前5）
*  type : import 或者 export
* */
var convertData = function(province,tradeData,type){
	var res=[];
	//var provinceName = nameMap[province];//英文名
	var proData = selectedSheet[province];//当前图的全部数据，即当前选中的行数据
	for(var i=0;i<tradeData.length;i++){
		var fromCoord = [proData.longitude, proData.latitude];
		var toCoord=[ tradeData[i].longitude,tradeData[i].latitude  ];
		var tagPosition="middle";  //标签的位置，
		if("import"===type){//如果是进口  ,转换箭头方向
			var temp =fromCoord;
			fromCoord=toCoord;
			toCoord=temp;
			tagPosition="start";
		}
		if(fromCoord && toCoord){
			res.push({
				name: province + " "+type+" "+tradeData[i].name,
				coords: [fromCoord, toCoord],
				value:parseInt(tradeData[i].value/1000000000000000), //除以2的15次方
				label :{		// 单个数据（单条线）的标签设置
					normal:{
						show:isShowSign,
						position :tagPosition,
						formatter:'{c}',
						fontWeight:'lighter',// 文字字体的粗细
						fontSize:20,  //标签字体的大小
					}
				},
				symbolSize :15, //箭头大小
				lineStyle:{
						normal:{
							//width: ,   //线宽
							opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
							curveness: 0
						}
					}
			});
		}
	}
	return res;
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
			initEchart(row);
			selectedSheet=row;
			selectedPros=[]; //清空
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
	//新增提交
	/*$("#commitBtn").bind('click', function(){
		$("#addForm").submit();
		//TODO 新增提交成功之后，进行修改datas参数，然后对table进行refresh
		initData();
		//$('#tableContainer').bootstrapTable('refresh');
	});*/
	
	//增加缩进/展开功能
	$("#hideList").bind("click", function(){
		if($(".bootstrap-table").css("display") == 'none') {
			$(".bootstrap-table").show();
			$("#tableDiv").css("width", "25.0%");
			$("#mapDiv").css("width", "75.0%");

			$("#hideList > img").attr("src", "/static/img/left.png").attr("title", "缩进");
			$("#button").show();
			$("#delBtn").show();
			$("#refBtn").show();
			$("#switchBtn").show();
			$("#switchSignBtn").show();
			$(".hiddenClass").show();
		}else {
			$(".bootstrap-table").hide();
		  	$("#tableDiv").css("width", "3%");
			$("#mapDiv").css("width", "97%");
			$("#hideList > img").attr("src", "/static/img/right.png").attr("title", "展开");
			$("#button").hide();
			$("#delBtn").hide();
			$("#refBtn").hide();
			$("#switchBtn").hide();
			$("#switchSignBtn").hide();
			$(".hiddenClass").hide();
		}
   	 	adjustScrollPage();
	});

	//贸易类型 按钮 ： 进口、出口、全部 ， 默认全部
	$("#import_li").bind("click",function(){ tradeType ="import"  ; generateSeries();myChart.setOption(option,true);})
	$("#export_li").bind("click",function(){ tradeType ="export"  ;generateSeries();myChart.setOption(option,true);  })
	$("#all_li").bind("click",function(){ tradeType ="all"  ;generateSeries();myChart.setOption(option,true); })

	//背景  :  黑色，白色  ，默认白色
	$("#black_li").bind("click",function(){ backGroundType ="black"  ; })
	$("#white_li").bind("click",function(){ backGroundType ="white"  ; })


	//标签  显示、隐藏，默认显示
	$("#show_li").bind("click",function(){ isShowSign =true  ; generateSeries();myChart.setOption(option,true);})
	$("#hide_li").bind("click",function(){ isShowSign =false  ;generateSeries();myChart.setOption(option,true); })

			//切换标签
		// var switchSignBtn =function(){
		// 	if(isShowSign){   //如果已经显示标签，那么切换为不显示
		// 		isShowSign=false;
		// 	}else{
		// 		isShowSign=true;
		// 	}
		// 	initTable(datas);
		// }

	//Modal验证销毁重构
	$('#myModal').on('hidden.bs.modal', function() {
    $("#saveadmin_form").data('bootstrapValidator').destroy();
    $('#saveadmin_form').data('bootstrapValidator', null);
    document.getElementById("saveadmin_form").reset();
    formValidator();
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
			async:false,
			url:"/deleteDataInMap2",
			data:{fileNameList:data},
			success:function(data){
				initData();
				$("#deleteResult").html(data);
				console.log(data);
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

//切换背景色
var switchBtn=function(){
	if(backgroundColor =='#404a59'){
		backgroundColor='#FFFAF0';
		color=[
			'#FF3030',
			'#0000CD',
			'#8A2BE2',
			'#7CFC00',
			'#838B8B',
			'#36648B',
			'#FFFF00',
			'#7A378B',
			'#00868B',
			'#6E8B3D'
		];
		areaColor='#DCDCDC';
		emphasisAreaColor='#808080';
		textColor='#2a333d';
		legendColor='#8A2BE2';
		geoTextColor="#FFFF00"

	}else{
		backgroundColor='#404a59';
		color=['#a6c84c',
				'#ffa022',
				'#FF3030',
				'#EE82EE',
				'#CDCD00',
				'#FFFF00',
				'#8A2BE2',
				'#43CD80',
				'#00CED1',
				'#46bee9'];
		areaColor='#323c48';
		emphasisAreaColor='#2a333d';
		textColor='#fff';
		legendColor='#fff';
		geoTextColor="#fff"
	}
	initTable(datas);
}




//初始化页面,  主要是表格数据
var initData=function(){
	$.ajax({
        type:"GET",
        async:false,
        url:"/initMap2",
        success:function (data) {
	        console.log(" initMap2 扫描成功");
	        datas=JSON.parse(data);
	        //initLoadResultFile();//初始化加载数据并保存
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
