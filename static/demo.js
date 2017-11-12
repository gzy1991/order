/**
 * Created by  on 2017/7/9.
 */



var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();//浏览器宽度
$("div.form-group").height(browserHeight+"px");
$("div.form-group").width(browserWidth+"px");

$("#tableDiv").height(browserHeight+"px");
var planePath = 'path://M1705.64,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
	var planePath2 = '';

// var dom = document.getElementById("mapContainer");
// var myChart = echarts.init(dom);
// option = null;
/*颜色*/
var color = [
		'#a6c84c',
		'#ffa022',
		'#FF3030',
		'#EE82EE',
		'#CDCD00',
		'#AEEEEE',
		'#8A2BE2',
		'#43CD80',
		'#0000CD',
 		'#46bee9'];

function randomValue() {
   	 	return Math.round(Math.random()*20);
	}
/* 初始化echart  ,第一次打开页面时、点击表格行事件时，调用本函数
*  入参：行数据  */
var dom;
var myChart;
var option;
var series ;
var initEchart=function(row){
	if(myChart&&myChart.dispose){
		myChart.dispose();
	}
	// 参考数据
	/*row={"danwei": "  ",
		"exportCountryNum": 5,
		"fileName": "temp_-176000",
		"importData": [
			{
				"sort": 1,
				"name": "Brazil",
				"data": [
					{"sort": 1, "name": "Algeria", "value": 550.16},
					{"sort": 2, "name": "Saudi Arabia", "value": 263.04},
					{"sort": 3, "name": "Nigeria", "value": 195.36},
					{"sort": 4, "name": "Argentina", "value": 178.44},
					{"sort": 5, "name": "USA", "value": 173.49}],
				"sum": 822.56,
				"countryNum": 5,
				"type": "import"},
			{
				"sort": 2,
				"name": "Kazakhstan",
				"data": [{"sort": 1,
					"name": "Russia",
					"value": 435.73}, {"sort": 2, "name": "UAE", "value": 15.38}, {"sort": 3, "name": "Azerbaijan", "value": 9.77}, {"sort": 4, "name": "Iran", "value": 5.11}, {"sort": 5, "name": "Turkmenistan", "value": 3.63}], "sum": 298.91, "countryNum": 5, "type": "import"}, {"sort": 3, "name": "Ukraine", "data": [{"sort": 1, "name": "Russia", "value": 565.66}, {"sort": 2, "name": "Turkmenistan", "value": 45.93}, {"sort": 3, "name": "Kazakhstan", "value": 20.62}, {"sort": 4, "name": "Azerbaijan", "value": 14.5}, {"sort": 5, "name": "Iran", "value": 6.75}], "sum": 254.02, "countryNum": 5, "type": "import"}, {"sort": 4, "name": "Georgia", "data": [{"sort": 1, "name": "Azerbaijan", "value": 276.61}, {"sort": 2, "name": "Russia", "value": 18.99}, {"sort": 3, "name": "Turkmenistan", "value": 15.31}, {"sort": 4, "name": "Iran", "value": 4.82}, {"sort": 5, "name": "UAE", "value": 2.78}], "sum": 231.98, "countryNum": 5, "type": "import"}, {"sort": 5, "name": "Oman", "data": [{"sort": 1, "name": "UAE", "value": 154.64}, {"sort": 2, "name": "Saudi Arabia", "value": 123.76}, {"sort": 3, "name": "Qatar", "value": 2.91}, {"sort": 4, "name": "Norway", "value": 2.9}, {"sort": 5, "name": "Kuwait", "value": 2.6}], "sum": 200.22, "countryNum": 5, "type": "import"}],
		"exportData": [
			{
				"sort": 1,
				"name": "Saudi Arabia",
				"data": [
					{"sort": 1, "name": "India", "value": 3794.33},
					{"sort": 2, "name": "Japan", "value": 1648.28},
					{"sort": 3, "name": "South Korea", "value": 1607.56},
					{"sort": 4, "name": "China", "value": 1145.7},
					{"sort": 5, "name": "UK", "value": 537.82}],
				"sum": 13004.6,
				"countryNum": 5,
				"type": "export"},
			{
				"sort": 2, "name": "Russia", "data": [{"sort": 1, "name": "China", "value": 1242.62}, {"sort": 2, "name": "Germany", "value": 629.28}, {"sort": 3, "name": "Ukraine", "value": 565.66}, {"sort": 4, "name": "UK", "value": 448.72}, {"sort": 5, "name": "Kazakhstan", "value": 435.73}], "sum": 6522.1, "countryNum": 5, "type": "export"}, {"sort": 3, "name": "Canada", "data": [{"sort": 1, "name": "USA", "value": 2889.5}, {"sort": 2, "name": "China", "value": 195.54}, {"sort": 3, "name": "Mexico", "value": 79.69}, {"sort": 4, "name": "Germany", "value": 64.61}, {"sort": 5, "name": "Japan", "value": 51.45}], "sum": 3701.18, "countryNum": 5, "type": "export"}, {"sort": 4, "name": "UAE", "data": [{"sort": 1, "name": "Japan", "value": 859.45}, {"sort": 2, "name": "South Korea", "value": 387.1}, {"sort": 3, "name": "China", "value": 327.54}, {"sort": 4, "name": "Iran", "value": 324.76}, {"sort": 5, "name": "India", "value": 251.79}], "sum": 3368.48, "countryNum": 5, "type": "export"}, {"sort": 5, "name": "USA", "data": [{"sort": 1, "name": "Mexico", "value": 428.16}, {"sort": 2, "name": "Canada", "value": 368.75}, {"sort": 3, "name": "China", "value": 328.14}, {"sort": 4, "name": "Singapore", "value": 211.76}, {"sort": 5, "name": "Japan", "value": 199.79}], "sum": 3289.3, "countryNum": 5, "type": "export"}], "importCountryNum": 5}	/!**!/
*/
	dom = document.getElementById("mapContainer");
	myChart = echarts.init(dom);
	option = null;
	series =[];  //初始化 series数据
	var legendNameList=[];
	var legendSelected={};
	row.exportData.forEach(function(item,i){legendNameList.push("export"+item.sort+":"+item.name)  ;});
	row.importData.forEach(function(item,i){legendNameList.push("import"+item.sort+":"+item.name)  ;});
	legendNameList.forEach(function(item,i){ legendSelected[item]=false    ;});  //初始化时，图例不选中

	generateSeries(row.exportData,"export");
	generateSeries(row.importData,"import");

	option = {
		backgroundColor: '#404a59',
		//backgroundColor: '#FFFAF0',
		title : {
			text: '',
			subtext: '',
			left: 'center',
			textStyle : {
				color: '#fff'
			}
		},
		tooltip : {  													//提示框组件。  数据项图形触发,主要在散点图,饼图等无类目轴的图表中使用。
			trigger: 'item'
		},
		legend: {       												//图例组件。图例组件展现了不同系列的标记(symbol),颜色和名字。可以通过点击图例控制哪些系列不显示。
			selected:legendSelected,
			align:"left",  //对齐
			orient: 'vertical',  //horizontal
			top: 'bottom',
			left: 'right',
			data:legendNameList,
			textStyle: {
				color: '#fff'
			},
			selectedMode: 'false' 									//single    false  multiple
		},
	geo: {
			map: 'world',//china
			label: {
			//normal: {
			//        show: true
			 //   },
				emphasis: {
					show: true
				}
			},
			roam: true,         										//是否开启鼠标缩放和平移漫游
			itemStyle: {
				normal: {
					areaColor: '#323c48',       						//地图区域的颜色。
					borderColor: '#404a59'  							//fff  404a59   描边颜色
				},
				emphasis: {
					areaColor: '#2a333d'
				}
			}
		},
		series: series
		};;
		myChart.setOption(option, true);
}

	/* 数据处理：把后台传过来的数据，转换成echart所需要的格式 */
	function generateSeries(datas,type) {
		datas.forEach(function (item, i) {
			series.push({
				//移动的亮点
				name: type+""+item.sort+":"+item.name  ,
				type: 'lines',
				zlevel: 1,  									//线图所有图形的 zlevel 值。
				effect: {              							//线特效的配置
					show: true,
					period: 1,              					//特效动画的时间,单位为 s。
					color: '#fff',
					symbolSize: 3          						//特效标记的大小,可以设置成诸如 10 这样单一的数字,也可以用数组分开表示高和宽,例如 [20, 10] 表示标记宽为20,高为10。
				},
				lineStyle: {            						//对线的各种设置 ：颜色,形状,曲度
					normal: {
						color: color[i],
						width: 0,           					//线宽
						curveness: 0.4  						//边的曲度,支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
					}
				},
				data: convertData(item)
			},
			{
				//  线  +  飞机
				name: type+""+item.sort+":"+item.name  ,
				type: 'lines',
				zlevel: 2,
				symbol: ['none', 'arrow'],
				symbolSize: 20,
				effect: {
					show: true,
					period: 6,
					trailLength: 0,
				},
				lineStyle: {
					normal: {
						color: color[i],
						//width: 1,           					//线宽与数值有关
						opacity: 0.6,    						//图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
						curveness: 0.4
					}
				},
				data: convertData2(item)
			},
			{
				// 国家名字
				name: type+""+item.sort+":"+item.name  ,
				type: 'effectScatter',              		//带有涟漪特效动画的散点（气泡）图
				coordinateSystem: 'geo',            		//该系列使用的坐标系,可选： cartesian2d二维的直角坐标系   polar极坐标系  geo地理坐标系
				zlevel: 2,
				rippleEffect: {                     		//涟漪特效相关配置
					brushType: 'stroke'             		//波纹的绘制方式   可选 'stroke' 和 'fill'
				},
				label: {                        			//图形上的文本标签,可用于说明图形的一些数据信息,
					normal: {
						show: true,
						position: 'right',      			//标签的位置。

						formatter: '{b}'           			//标签内容格式器,支持字符串模板和回调函数两种形式,字符串模板与回调函数返回的字符串均支持用 \n 换行。
															//模板变量有 {a}、{b}、{c},分别表示系列名,数据名,数据值。
					}
				},
				symbolSize: function (val) {            	//标记的大小,可以设置成诸如 10 这样单一的数字,也可以用数组分开表示宽和高
					//return val[2] ;
					return 2 ;
				},
				itemStyle: {
					normal: {
						color: color[i]
					}
				},
				data:item.data.map(function(dataItem){
					return {
						name:dataItem.name+":"+""+" "+dataItem.sum,
						value:[
							countrytInfo[dataItem.name].longitude,
							countrytInfo[dataItem.name].latitude,
							dataItem.value
						]
					}
				})
			});
		});
	}

	//额外设置线宽
	var convertData2 = function (item) {
		var res = [];
		for (var i = 0; i < item.data.length; i++) {
			var dataItem = item.data[i];
			var fromCoord = [countrytInfo[item["name"]]["longitude"],countrytInfo[item["name"]]["latitude"]];
			var toCoord = [countrytInfo[dataItem["name"]]["longitude"],countrytInfo[dataItem["name"]]["latitude"]];
			if("import"===item.type){  //如果是进口  ,转换箭头方向
					var temp =fromCoord;
					fromCoord=toCoord;
					toCoord=fromCoord;
				}
			if (fromCoord && toCoord) {
				res.push({
					fromName: item["name"],
					toName: dataItem["name"],
					coords: [fromCoord, toCoord],
					value:dataItem.value,
					label :{
						normal:{
							show:true,
							position :'middle',
							formatter:'{c}',
							textStyle :{
								formatter :(dataItem.value/item.sum)*10
							}
						}
					},
					//symbolSize :dataItem.value*1.1, //箭头大小
					symbolSize :15, //箭头大小
					lineStyle:{
						normal:{
							width: (dataItem.value/item.sum)*10,
							opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
							curveness: 0.4
						}
					}
				});
			}
		}
		return res;
};
/**/
var convertData = function(item){
		var res = [];
		for (var i = 0; i < item.data.length; i++) {
			var dataItem = item.data[i];
			var fromCoord = [countrytInfo[item["name"]]["longitude"],countrytInfo[item["name"]]["latitude"]];
			var toCoord = [countrytInfo[dataItem["name"]]["longitude"],countrytInfo[dataItem["name"]]["latitude"]];
			if("import"===item.type){  //如果是进口  ,转换箭头方向
				var temp =fromCoord;
				fromCoord=toCoord;
				toCoord=fromCoord;
			}

			if (fromCoord && toCoord) {
				res.push({
					fromName: item["name"],
					toName: dataItem["name"],
					coords: [fromCoord, toCoord],
					value:dataItem.value,
					label :{
						normal:{
							show:true,
							position :'middle',
							formatter:'{c}',
							textStyle :{
								formatter :(dataItem.value/item.sum)*10
							}
						}

					}
				});
			}
		}
		return res;
	}

//保存
function saveAdmin(){
   	//开启验证
    $('#saveadmin_form').data('bootstrapValidator').validate();  
 		if(!$('#saveadmin_form').data('bootstrapValidator').isValid()){  
 			return ;  
		} 
}

//初始化表单验证
$(document).ready(function() {
    formValidator();
});

//form验证规则
function formValidator(){
	$('#saveadmin_form').bootstrapValidator({
	    message: 'This value is not valid',
	   
	    fields: {//标题
	        edit_adminName: {
	            message: '标题验证失败',
	            validators: {
	                notEmpty: {
	                    message: '标题不能为空'
	                },
	                stringLength: {
	                    min: 1,
	                    max: 20,
	                    message: '标题长度必须在1到20位之间'
	                }
	            }
	        },//单位
	        edit_displayName: {
	            message: '单位验证失败',
	            validators: {
	                notEmpty: {
	                    message: '单位不能为空'
	                },
	                stringLength: {
	                    min: 1,
	                    max: 20,
	                    message: '单位长度必须在1到20位之间'
	                }
	            }
	        },//文件上传
	        inputcsv1: {
	            message: '文件上传验证失败',
	            validators: {
	                notEmpty: {
	                    message: '文件上传不能为空'
	                }
	            }
	        },//文件上传
	        inputcsv2: {
	            message: '文件上传验证失败',
	            validators: {
	                notEmpty: {
	                    message: '文件上传不能为空'
	                }
	            }
	        },//文件上传
	        inputcsv3: {
	            message: '文件上传验证失败',
	            validators: {
	                notEmpty: {
	                    message: '文件上传不能为空'
	                }
	            }
	        }
	    }
	});
}

//页面自适应
var adjustScrollPage = function() {
	var windowEl = $(window);
	var windowH = windowEl.height();
    var windowW = windowEl.width();
    $('#bodyId').css('height', windowH).css('width', windowW);
    $("#tableDiv").css("height", windowH);
    setTimeout(function(){
		dom.style.width = (window.innerWidth - $("#tableDiv").width())+'px';
		dom.style.height = (window.innerHeight - 5)+'px';
    	 
    	myChart.resize();
		// if (option && typeof option === "object") {
		// 	option.title.text = '世界各国进出口';
		// 	option.title.subtext = '单位：千亿美元';
		// 	genSeries([['China', CNData], ['USA', USAData]]);
		// 	option.legend.data = ['China Top5', 'USA Top5'];
	    	// myChart.setOption(option, true);
		// }
    },100);
}




//初始化渲染表格数据
var initTable = function(datas) {
	$("#tableDiv").css("padding-right", 0);
	$('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			initEchart(row);
		},

	    columns: [{  
            checkbox: true  
        },{
	        //field: 'id',
	        field: 'fileName',
	        title: '<span class="tabldTitle">数据列表</span>'
	    }],
	    data: datas
	});
	if(datas && datas.length>0){
		console.log("第一次初始化echart: "+datas[0].fileName);
		initEchart(datas[0]);
	}
}

//初始化事件绑定
var initEvent = function() {
	//新增提交
	$("#commitBtn").bind('click', function(){
		$("#addForm").submit();
		//TODO 新增提交成功之后，进行修改datas参数，然后对table进行refresh
		$('#tableContainer').bootstrapTable('refresh');
	});
	
	//增加缩进/展开功能
	$("#hideList").bind("click", function(){
		if($(".bootstrap-table").css("display") == 'none') {
			$(".bootstrap-table").show();
			$("#tableDiv").css("width", "16.66666667%");
			$("#mapDiv").css("width", "83.33333333%");
			$("#hideList > img").attr("src", "/static/img/left.png").attr("title", "缩进");
			$("#button").show();
			$("#delBtn").show();
		}else {
			$(".bootstrap-table").hide();
		  	$("#tableDiv").css("width", "3%");
			$("#mapDiv").css("width", "97%");
			$("#hideList > img").attr("src", "/static/img/right.png").attr("title", "展开");
			$("#button").hide();
			$("#delBtn").hide();
		}
   	 	adjustScrollPage();
	});
	
	//单据左侧列表触发click
	// $("#tableContainer td").bind("click", function(e){
	// 	var tar = e.target;
	// 	//在这里设置右侧地图的标题
	// 	option.title.text = $(tar)[0].innerText;
	// 	option.title.subtext = '单位：' + $(tar).parent().attr("data-index") + '万亿美元';
	// 	genSeries([['China', CNData], ['USA', USAData]]);
	// 	option.legend.data = ['China Top5', 'USA Top5'];
	// 	myChart.setOption(option, true);
	// 	//alert($(tar).parent().attr("data-index"));
	// });
	
	//Modal验证销毁重构
	$('#myModal').on('hidden.bs.modal', function() {
    $("#saveadmin_form").data('bootstrapValidator').destroy();
    $('#saveadmin_form').data('bootstrapValidator', null);
    document.getElementById("saveadmin_form").reset();
    formValidator();
	});
}

//初始化导入csv文件并保存
function initLoadResultFile () {
	//TODO 通过ajax加载返回json格式数据
	initTable(datas);
}

//窗体改变时触发
window.onresize = function(){
	adjustScrollPage();
}


//删除表格行
var delBtnFn = function() {
	var a= $('#tableContainer').bootstrapTable('getSelections');  
	if(typeof a != null || a.length == 0) {
		$.Message.popup("提示", "请选中记录进行删除!");
		return;
	}
	$.each(a, function(i, item) {
		alert(item.title);
	});
}
