/**
 * Created by  on 2018/1/19
 */

//全局变量

//背景切换所需的数据
var backgroundColor ='#404a59';  //echart背景色
var areaColor ='#323c48'; //地图区域的颜色
var emphasisAreaColor='#2a333d';   //选中省份时，背景色
var textColor='#fff';					//标题与副标题的颜色
var lineColor ="#FF3030";					//线和线上标签的颜色
var geoTextColor="#fff"; //地图上，选中国家时，国家名的颜色
var lineeffectColor = "#fff";   //线上特效点的颜色
var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();		//浏览器宽度
$("#tableDiv").height(browserHeight+"px");
var provinceColor ={//  省份 线的颜色
	"Jiangsu":"#a6c84c","Anhui":"#a6c84c","Fujian":"#a6c84c","Shanghai":"#a6c84c","Zhejiang":"#a6c84c","Shandong":"#a6c84c",
	"Hubei":"#ffa022","Hunan":"#ffa022","Henan":"#ffa022","Jiangxi":"#ffa022",
	"Guangdong":"#EE82EE","Guangxi":"#EE82EE","Hainan":"#EE82EE",
	"Beijing":"#7CFC00","Tianjin":"#7CFC00","Hebei":"#7CFC00","Shanxi":"#7CFC00","Inner mongolia":"#7CFC00",
	"Chongqing":"#43CD80","Sichuan":"#43CD80","Guizhou":"#43CD80","Yunnan":"#43CD80",
	"Shaanxi":"#46bee9","Gansu":"#46bee9","Qinghai":"#46bee9","Ningxia":"#46bee9","Xinjiang":"#46bee9","Tibet":"#46bee9",
	"Liaoning":"#CDCD00","Jilin":"#CDCD00","Heilongjiang":"#CDCD00"
}

//echart全局变量
var dom = document.getElementById("mapContainer");;
var myChart = echarts.init(dom);;
var option = null;
var seriesData =[]; //  容器，存储线的数据
var unit='';  //单位
var tradeType="export" ; 	//进出口类型，进口import、出口export 或者全部all，默认是export
var isShowSign=true;  	//是否显示标签 ，默认显示

var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedSheet;   		//table中选中的那一行 的行数据
var selectedPros= [];  	//图中选中的省份名集合
var lines ;  //线  ，数据容器
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

var geoData=[ 			// 选中的省份,初始化的时候是空.当点击省份时，更新这个数据
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
			subtextStyle : {		//副标题
				fontFamily:"Times New Roman",//字体
				color: textColor
			},
			textStyle : {
				fontFamily:"Times New Roman",//字体
				color: textColor
			}
		},
		//地图
	  	geo: {
	      	show:true,
	      	map: 'china',
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
		    label: {   //标签
		      	position:'left',
		      	show:false,
		      	normal: {
		          	show: false
		      	},
		      	emphasis: {
		      		fontFamily : "Times New Roman",//字体
					color :geoTextColor,
		            show: false
		      	}
    		},
	    	regions:geoData
	    }
	};
	if(selectedPros.length>0){  //如果点击了切换背景，那么这个线数据的颜色变了，要重新生成，
		generateSeries();
	}
	myChart.setOption(option, true);

	//绑定省份的点击事件
	myChart.on('click', function (params) {
		if("geo"!=params.componentType){  //如果点击的不是地图的省份，那么跳过，不处理
			return;
		}
    	var name =  params.region.name;  //省份名  英文名

		if("Hong Kong,Macau,Taiwan,香港,澳门,台湾".indexOf(name)!=-1 || name ==undefined){  //有几个省份是忽略的
			myChart.setOption(option,true);
			return;
		}else if(   !(selectedSheet[name]&&selectedSheet[name].exportSum!=0 && selectedSheet[name].importSum!=0 )  ){
			/*有些省份的数据可能是0，这时候不显示这个省份的线*/
			myChart.setOption(option,true);
			return;
		}
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
				option.geo.regions=geoData;
			}
		}else if(isSelected){   //否则 ,删除
			var index=selectedPros.indexOf(name);
			if(index!== -1){
				selectedPros.splice(index,1);
				//取消选中，删除这个省份
				var tempGeoData=[];
				geoData.forEach(function(item,i){
					if(item.name != name && item.name!=nameMap[name]){
						tempGeoData.push(item);
					}
				});
				geoData=tempGeoData;
				//划线
				generateSeries();  //生成series数据 ，包括 线数据，线特效，选中的省份的名字和相关省份的名字
				option.geo.regions=geoData;
			}
		}
		myChart.setOption(option,true);
	});
}

/* 根据当前选中的省份 和 进出口类型，生成series */
var generateSeries = function(){
	seriesData=[];  //先清空之前的线
	if(tradeType == "import"){
		generateLinesAndName("import");
	}else if (tradeType=="export"){
		generateLinesAndName("export");
	}else if (tradeType  =="all"){
		generateLinesAndName("import");
		generateLinesAndName("export");
	}
	option.series=seriesData;
}

/* 生成省份名  以及省份名字的的圆圈动画效果
* province ：省份英文名
* isSelected: 是否是选中省份 ：true  false      （false 意味着只是关联省份，而不是选中省份）
* */
var generateProName = function(province,isSelected){
	/*进出、出口或进出口总值*/
	var provinceShowData=0;
	if(tradeType=="import"){
		provinceShowData=selectedSheet[province].importSum
	}else if (tradeType=="export"){
		provinceShowData=selectedSheet[province].exportSum
	}else{
		provinceShowData=selectedSheet[province].exportSum+selectedSheet[province].importSum
	}
	provinceShowData=(provinceShowData/1000000000000000).toFixed(2);/*进出、出口或进出口总值，如果有需要，会显示在省份名后*/
	var flag=true;
	seriesData.forEach(function(item,i){
		if(item.name ==province ){ //如果省份名已经存在了，那就不用再加了
			if( isSelected){  //此时要先更新数据
				item.label.normal.formatter=province+":"+provinceShowData;
			}
			flag=false;
		}
	})
	if(!flag){
		return;
	}
	seriesData.push({  //选中的省份的名字，以及圆圈动画效果
		name:province,
		type:"effectScatter",
		coordinateSystem: 'geo',
		zlevel: 2,
		rippleEffect: {                     		//涟漪特效相关配置
			scale:2,
			brushType: 'stroke'             		//波纹的绘制方式   可选 'stroke' 和 'fill'
		},
		label:{								//图形上的文本标签,可用于说明图形的一些数据信息
			normal: {
				fontFamily : "Times New Roman" ,  //字体
				show: isShowSign,
				position: [10, 10],      			//标签的位置。
				formatter: function(params){
					if(isSelected){
						return province+":"+provinceShowData
					}else{
						return province
					}
				}
			}
		},
		symbolSize: function (val) {            	//标记的大小,可以设置成诸如 10 这样单一的数字,也可以用数组分开表示宽和高
			return 5 ;
		},
		itemStyle: {
			normal: {
				//color: geoTextColor
				color: provinceColor[province]
			}
		},
		data:[{
			name:province,
			value:[
				selectedSheet[province].longitude,
				selectedSheet[province].latitude,
				selectedSheet[province].latitude.sum
			]
		}]
	});
}

/*生成线  以及省份名
*  type: import 或 export
* */
var generateLinesAndName = function(type ){
	//selectedSheet 当前选中的table行数据
	//selectedPros  当前选中的省份数据
	lines=[];
	if(selectedPros && selectedPros.length>0){
		selectedPros.forEach( function(province,i){  //遍历省份    province是英文名，
			generateProName(province,true);
			var tradeData=[];
			if(type=="import"){
				tradeData = selectedSheet[province].importData  ;//进口
			}else if (type=="export"){
				tradeData = selectedSheet[province].exportData  ;//出口
			}
			if(tradeData && tradeData.length>0){  //遍历这个省份的出口或进口数据
				tradeData.forEach(function(item,j){
					generateProName(item.name,false);
				});
			}
			seriesData.push(
				//动画效果，移动的亮点
				{
					name:province+"_light",
					type:"lines",
					zlevel: 1,
					effect: {              							//线特效的配置
						show: isShowSign,
						period: 1,              					//特效动画的时间,单位为 s。
						color: lineeffectColor,						//特效颜色
						symbolSize: 4          						//特效标记的大小,可以设置成诸如 10 这样单一的数字,也可以用数组分开表示高和宽,例如 [20, 10] 表示标记宽为20,高为10。
					},
					lineStyle: {            						//对线的各种设置 ：颜色,形状,曲度
						normal: {
							color: lineeffectColor,                   //
							width: 0,           					//线宽
							curveness: 0.2  						//边的曲度,支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
						}
					},
					data:convertData2(province,tradeData,type)  //坐标关系
				}
				,
				//  线  +  箭头
				{
				name: province+"_line"  ,
				type: 'lines',
				zlevel: 2,
				symbol: ['none', 'arrow'],
				//symbolSize: 10,
				effect: { //线特效  ，这里先不显示
					show: false,
					period: 6,
					trailLength: 0,
				},
				lineStyle: {
					normal: {
						color:provinceColor[province],
						opacity: 0.6,    						//图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
					}
				},
				data: convertData(province,tradeData,type)  //坐标关系
			}
			);

		})
	}
}
/*
*	生成动画效果线的 坐标关系
*   直接调用convertData() ，然后获取里面的坐标信息即可
* */
var convertData2=function(province,tradeData,type){
	var coords=[];
	var tempData =convertData(province,tradeData,type);//坐标关系
	tempData.forEach(function(item,i){
		coords.push({
			coords:item.coords,
			effect: {
				show: isShowSign,
				period: 4,
				color: lineeffectColor,						//特效颜色
				symbolSize: 10-item.sort*1.5
			}
		});
	});
	return coords;
}

/* 生成普通线的 坐标关系
*  province 选中的省份,英文名
*  tradeData： 这个省份的贸易数据  （出口前5或者进口前5）
*  type : import 或者 export
* */
var convertData = function(province,tradeData,type){
	var res=[];
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
		tagPosition="middle";  //标签的位置,仙豆设置成中间，
		if(fromCoord && toCoord){
			res.push({
				sort:tradeData[i].sort,  //排序数据
				coords: [fromCoord, toCoord],
				value:(tradeData[i].value/1000000000000000).toFixed(2), //除以2的15次方
				label :{		// 单个数据（单条线）的标签设置
					normal:{
						show:isShowSign, //
						position :tagPosition,
						formatter:'{c}',
						//fontWeight:'lighter',// 文字字体的粗细
						fontWeight:'bolder',// 文字字体的粗细
						fontSize:12,  //标签字体的大小
						fontFamily : "Times New Roman"//字体
					}
				},
				symbolSize :20-tradeData.length* tradeData[i].sort, //箭头大小，根据贸易量排序，大小不同
				lineStyle:{
						normal:{
							width:tradeData.length+1-tradeData[i].sort,  //线宽
							opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
							curveness:0.2     //线的弯曲程度
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

	//切换背景色 :  黑色，白色  ，默认黑色
	$("#black_li").bind("click",function(){  //切换成黑色背景
		backgroundColor='#404a59';
		areaColor='#323c48';
		emphasisAreaColor='#2a333d';
		textColor='#fff';
		legendColor='#fff';
		geoTextColor="#fff";
		lineColor="#FF3030";
		lineeffectColor="#fff";
		provinceColor ={//  省份 线的颜色
			"Jiangsu":"#a6c84c","Anhui":"#a6c84c","Fujian":"#a6c84c","Shanghai":"#a6c84c","Zhejiang":"#a6c84c","Shandong":"#a6c84c",
			"Hubei":"#ffa022","Hunan":"#ffa022","Henan":"#ffa022","Jiangxi":"#ffa022",
			"Guangdong":"#EE82EE","Guangxi":"#EE82EE","Hainan":"#EE82EE",
			"Beijing":"#7CFC00","Tianjin":"#7CFC00","Hebei":"#7CFC00","Shanxi":"#7CFC00","Inner mongolia":"#7CFC00",
			"Chongqing":"#43CD80","Sichuan":"#43CD80","Guizhou":"#43CD80","Yunnan":"#43CD80",
			"Shaanxi":"#46bee9","Gansu":"#46bee9","Qinghai":"#46bee9","Ningxia":"#46bee9","Xinjiang":"#46bee9","Tibet":"#46bee9",
			"Liaoning":"#CDCD00","Jilin":"#CDCD00","Heilongjiang":"#CDCD00"
		}
		initEchart(selectedSheet);
	})
	$("#white_li").bind("click",function(){ //切换成白色背景
		backgroundColor='#FFFAF0';
		areaColor='#DCDCDC';
		//emphasisAreaColor='#808080';
		//emphasisAreaColor='#A3A3A3';
		emphasisAreaColor='#C1C1C1';
		textColor='#2a333d';
		legendColor='#8A2BE2';
		geoTextColor="#2a333d";
		lineColor="#000000";
		//lineeffectColor="#FF3030";
		//lineeffectColor="#FFBA6F";
		//lineeffectColor="#FFA48E";
		//lineeffectColor="#16FF59";
		lineeffectColor="#FFFAF0";
		provinceColor ={//  省份 线的颜色
			"Jiangsu":"#800000","Anhui":"#800000","Fujian":"#800000","Shanghai":"#800000","Zhejiang":"#800000","Shandong":"#800000",
			"Hubei":"#00868B","Jiangsu":"#00868B","Henan":"#00868B","Jiangxi":"#00868B",
			"Guangdong":"#0000CD","Guangxi":"#0000CD","Hainan":"#0000CD",
			"Beijing":"#8A2BE2","Tianjin":"#8A2BE2","Hebei":"#8A2BE2","Shanxi":"#8A2BE2","Inner mongolia":"#8A2BE2",
			"Chongqing":"#006400","Sichuan":"#006400","Guizhou":"#006400","Yunnan":"#006400",
			"Shaanxi":"#7A378B","Gansu":"#7A378B","Qinghai":"#7A378B","Ningxia":"#7A378B","Xinjiang":"#7A378B","Tibet":"#7A378B",
			"Liaoning":"#8B4513","Jilin":"#8B4513","Heilongjiang":"#8B4513"
		}
		initEchart(selectedSheet);
	})


	//标签  显示、隐藏，默认显示
	$("#show_li").bind("click",function(){ isShowSign =true  ; generateSeries();myChart.setOption(option,true);})
	$("#hide_li").bind("click",function(){ isShowSign =false  ;generateSeries();myChart.setOption(option,true); })
	//Modal验证销毁重构
	$('#myModal').on('hidden.bs.modal', function() {
		$('#saveadmin_form').data('bootstrapValidator', null);
		document.getElementById("saveadmin_form").reset();
		$("#addButtonResult").html("");  //隐藏弹出框后，把提示信息清空
	});
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
			url:"/deleteDataInMap2",
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
        url:"/initMap2",
        success:function (data) {
	        console.log(" initMap2 扫描成功");
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
