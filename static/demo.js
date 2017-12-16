/**
 * Created by  on 2017/7/9.
 */

var backgroundColor ='#404a59';  //echart背景色
/*划线的颜色*/
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
var areaColor ='#323c48'; //地图区域的颜色
var emphasisAreaColor='#2a333dfff';   //选中国家时，背景色
var textColor='#fff';
var legendColor='#fff';
var datas ;
var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();		//浏览器宽度
// $("div.form-group").height(browserHeight+"px");
// $("div.form-group").width(browserWidth+"px");

$("#tableDiv").height(browserHeight+"px");
//var planePath = 'path://M1705.64,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
//	var planePath2 = '';

/* 初始化echart  ,第一次打开页面时、点击表格行事件时，调用本函数
*  入参：行数据  */
var dom = document.getElementById("mapContainer");;
var myChart;
var option;
var series ;
var unit='';
var initEchart=function(row){
	if(myChart&&myChart.dispose){
		myChart.dispose();
	}
	unit='';
	if(row.unit && row.unit!==''){
		unit=row.unit;
	}else{
		unit='undefined'
	}
	dom = document.getElementById("mapContainer");
	myChart = echarts.init(dom);
	option = null;
	series =[];  //初始化 series数据
	var legendNameList=[];
	var legendSelected={};
	row.exportData.forEach(function(item,i){legendNameList.push("Export"+item.sort+": "+item.name)  ;});
	row.importData.forEach(function(item,i){legendNameList.push("Import"+item.sort+": "+item.name)  ;});
	legendNameList.forEach(function(item,i){ legendSelected[item]=false    ;});  //初始化时，图例不选中
	generateSeries(row.exportData,"Export");
	generateSeries(row.importData,"Import");

	option = {
		backgroundColor: backgroundColor,
		title : {
			text: row.fileName,
			subtext: 'Unit：'+unit,
			left: 'center',
			textStyle : {
				color: textColor
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
			inactiveColor :'#6E8B3D',
			textStyle: {
				color: legendColor
			},
			selectedMode: 'false' 									//single    false  multiple
		},
	geo: {
			map: 'world',//china
			label: {
				emphasis: {
					show: true
				}
			},
			roam: true,         										//是否开启鼠标缩放和平移漫游
			itemStyle: {
				normal: {
					areaColor: areaColor,       						//地图区域的颜色。
					//areaColor: '#FFFAF0',       						//地图区域的颜色。
					borderColor: '#404a59'  							//fff  404a59   描边颜色
				},
				emphasis: {
					areaColor:emphasisAreaColor
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
				name: type+""+item.sort+": "+item.name  ,
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
						color: color[i%10],                   //求余
						width: 0,           					//线宽
						curveness: 0.4  						//边的曲度,支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
					}
				},
				data: convertData(item)
			},
			{
				//  线  +  飞机
				name: type+""+item.sort+": "+item.name  ,
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
			{  //国家名字  目标国家
				name: type+""+item.sort+": "+item.name,
				type: 'effectScatter',
				coordinateSystem: 'geo',
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
					return 2 ;
				},
				itemStyle: {
					normal: {
						color: color[i]
					}
				},
				data:[{
					name:item.name+":"+""+" "+item.sum,
					value:[
							countrytInfo[item.name].longitude,
							countrytInfo[item.name].latitude,
							item.value
					]
				}]
			},
			{
				// 国家名字  好几个国家
				name: type+""+item.sort+": "+item.name  ,
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
			if("import"===item.type){  //如果是进 口  ,转换箭头方向
					var temp =fromCoord;
					fromCoord=toCoord;
					toCoord=temp;
				}
			if (fromCoord && toCoord) {
				res.push({
					fromName: item["name"],
					toName: dataItem["name"],
					coords: [fromCoord, toCoord],
					value:dataItem.value,
					label :{  // 单个数据（单条线）的标签设置
						normal:{
							show:true,
							position :'middle',
							formatter:'{c}',
							textStyle :{
								formatter :(dataItem.value/item.sum)*10    //线宽。。 无效
							}
						}
					},
					//symbolSize :dataItem.value*1.1, //箭头大小
					symbolSize :15, //箭头大小
					lineStyle:{
						normal:{
							width: (dataItem.value/item.sum)*10,   //线宽
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
				toCoord=temp;
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
	$("#result").html("正在计算，请等待......");
	$.ajax(
		{
			type:"GET",
			async:false,
			url:"/calculate",
			data:$("#saveadmin_form").serialize(),
			success:function(data){
				$("#result").html(data);

				initData();
				//$('#tableContainer').bootstrapTable('refresh');
			}
		}

	)

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
	        title: {
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
	        unit: {
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

			fd_address:{
				message: '验证失败',
	            validators: {
	                notEmpty: {
	                    message: '路径不能为空'
	                },
	                stringLength: {
	                    min: 1,
	                    max: 100,
	                    message: '路径长度必须在1到100位之间'
	                }
	            }
			},
			e_address:{
				message: '验证失败',
	            validators: {
	                notEmpty: {
	                    message: '路径不能为空'
	                },
	                stringLength: {
	                    min: 1,
	                    max: 100,
	                    message: '路径长度必须在1到100位之间'
	                }
	            }

			},
			t_address:{
				message: '验证失败',
	            validators: {
	                notEmpty: {
	                    message: '路径不能为空'
	                },
	                stringLength: {
	                    min: 1,
	                    max: 100,
	                    message: '路径长度必须在1到100位之间'
	                }
	            }

			},

	        FD: {
	            message: '文件上传验证失败',
	            validators: {
	                notEmpty: {
	                    message: '文件上传不能为空'
	                }
	            }
	        },//文件上传
	        E: {
	            message: '文件上传验证失败',
	            validators: {
	                notEmpty: {
	                    message: '文件上传不能为空'
	                }
	            }
	        },//文件上传
	        T: {
	            message: '文件上传验证失败',
	            validators: {
	                notEmpty: {
	                    message: '文件上传不能为空'
	                }
	            }
	        }
	    }
	});

	$("input[id='FD']").change(function(){
		var file = this.files[0];
	   	if (window.FileReader) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				//监听文件读取结束后事件
			  	reader.onloadend = function (e) {
					$("#FD").attr("src",e.target.result);    //e.target.result就是最后的路径地址
					console.log(e.target.result);
				};
		   }
	});
	$("input[id='T']").change(function(){
		var file = this.files[0];
	   	if (window.FileReader) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				//监听文件读取结束后事件
			  	reader.onloadend = function (e) {
					$("#T").attr("src",e.target.result);    //e.target.result就是最后的路径地址
					console.log(e.target.result);
				};
		   }
	});
	$("input[id='E']").change(function(){
		var file = this.files[0];
	   	if (window.FileReader) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				//监听文件读取结束后事件
			  	reader.onloadend = function (e) {
					$("#E").attr("src",e.target.result);    //e.target.result就是最后的路径地址
					console.log(e.target.result);
				};
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
    },100);
}

//初始化渲染表格数据
var initTable = function(datas) {
	$("#tableDiv").css("padding-right", 0);
	//先销毁表格
	$('#tableContainer').bootstrapTable('destroy');
	$('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
		//showRefresh:true,
		onClickRow:function (row, $element, field) {/*表格的行点击事件*/
			console.log("你点击了行："+row.fileName);
			initEchart(row);
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
	}
	$('#loading').modal('hide');
}

//初始化事件绑定
var initEvent = function() {
	//新增提交
	$("#commitBtn").bind('click', function(){
		$("#addForm").submit();
		//TODO 新增提交成功之后，进行修改datas参数，然后对table进行refresh


		initData();
		//$('#tableContainer').bootstrapTable('refresh');
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
			$("#refBtn").show();
			$("#switchBtn").show();
		}else {
			$(".bootstrap-table").hide();
		  	$("#tableDiv").css("width", "3%");
			$("#mapDiv").css("width", "97%");
			$("#hideList > img").attr("src", "/static/img/right.png").attr("title", "展开");
			$("#button").hide();
			$("#delBtn").hide();
			$("#refBtn").hide();
			$("#switchBtn").hide();
		}
   	 	adjustScrollPage();
	});
	
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
	$("#deleteResult").html("正在删除数据，请稍候...");
	var selectedData= $('#tableContainer').bootstrapTable('getSelections');
	if(typeof selectedData === null || selectedData.length == 0) {
		$.Message.popup("提示", "请选中要删除的数据!");
		//$("#deleteResult").html("请选中要删除的数据");
		return;
	}
	$('#deleteModel').modal('show');
	$('#deleteModel').on('shown.bs.modal', function () {
		var data='';
		$.each(selectedData, function(i, item) {
			data=data+','+item.fileName;
		});
		data=data.substring(1,data.length)
		$.ajax({
			type:"GET",
			async:false,
			url:"/deleteData",
			data:{fileNameList:data},
			success:function(data){
				initData();
				$("#deleteResult").html(data);
				//$('#deleteModel').modal('hide');
				//$.Message.popup("提示", data);
				console.log(data);

			}
		});
    });
}
var closeDelModel=function(){
	$('#deleteModel').modal('hide');
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
	}
	initTable(datas);
}

//初始化页面数据  包括表格数据
var initData=function(){
	$.ajax({
         type:"GET",
         async:false,
         url:"/rank",
         success:function (data) {
             console.log("扫描成功");
             datas=JSON.parse(data);
             initLoadResultFile();//初始化加载数据并保存
             adjustScrollPage(); //页面自适应
             //页面加载完
            $(function(){

				$(".fixed-table-body").css("overflow", "hidden");
				$("#tableContainer > tbody > tr > td").css("cursor", "pointer");
				//$(".th-inner").css("background", "#00bfa5");
            });
         }
})
}
initData();
initEvent();
