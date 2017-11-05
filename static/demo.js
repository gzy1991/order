/**
 * Created by  on 2017/7/9.
 */


var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();//浏览器宽度
$("div.form-group").height(browserHeight+"px");
$("div.form-group").width(browserWidth+"px");

$("#tableDiv").height(browserHeight+"px");

var dom = document.getElementById("mapContainer");
var myChart = echarts.init(dom);
var app = {};
option = null;

//中国
var CNData = {
        "name":"China",                    //出口国
        "chineseName":"中国",
        "type":"export",              //import
        "sum":153.75,                      //进口或出口总和,不能为负数
        "sort":1,                       //排序
        "data":[
             {"name":"USA",   "chineseName":"美国",   "sort":1,   "value":29.19,"sum":25},
             {"name":"Hong Kong",   "chineseName":"香港",   "sort":2,   "value":23.37,"sum":32},
             {"name":"Japan",   "chineseName":"日本",   "sort":3,   "value":19.03,"sum":23},
             {"name":"South Korea",   "chineseName":"韩国",   "sort":4,   "value":9.85,"sum":44},
             {"name":"Germany",   "chineseName":"德国",   "sort":5,   "value":8.76,"sum":33}
        ]
    };
    
//美国
var USAData = {
    "name": "USA",                    //出口国
    "chineseName": "美国",
    "type": "output",              //input是进口
    "sum": 118.7,                      //进口或出口总和,不能为负数
    "sort": 2,                       //排序
    "data": [
        {"name": "Canada", "chineseName": "加拿大", "sort": 1, "value": 21.45,"sum":25},
        {"name": "Mexico", "chineseName": "墨西哥", "sort": 2, "value": 15.50,"sum":34},
        {"name": "Japan", "chineseName": "日本", "sort": 3, "value": 12.33,"sum":44},
        {"name": "China", "chineseName": "中国", "sort": 4, "value": 10.34,"sum":12},
        {"name": "South Korea", "chineseName": "韩国", "sort": 5, "value": 5.76,"sum":33}
    ]
};


var planePath = 'path://M1705.64,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
var planePath2 = '';

var convertData = function(item){
    var res = [];
    for (var i = 0; i < item.data.length; i++) {
        var dataItem = item.data[i];
        var fromCoord = [countrytInfo[item["name"]]["longitude"],countrytInfo[item["name"]]["latitude"]];
        var toCoord = [countrytInfo[dataItem["name"]]["longitude"],countrytInfo[dataItem["name"]]["latitude"]];
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
                            formatter :dataItem.value/10
                        }
                    }

                }
            });
        }
    }
    return res;
}

//额外设置线宽
var convertData2 = function (item) {
    var res = [];
    for (var i = 0; i < item.data.length; i++) {
        var dataItem = item.data[i];
        var fromCoord = [countrytInfo[item["name"]]["longitude"],countrytInfo[item["name"]]["latitude"]];
        var toCoord = [countrytInfo[dataItem["name"]]["longitude"],countrytInfo[dataItem["name"]]["latitude"]];
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
                            formatter :dataItem.value/10
                        }
                    }
                },
                //symbolSize :dataItem.value*1.1, //箭头大小
                symbolSize :15, //箭头大小
                lineStyle:{
                    normal:{
                        width: dataItem.value/5,
                        opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                        curveness: 0.4
                    }
                }
            });
        }
    }
    return res;
};

function randomValue() {
    return Math.round(Math.random()*20);
}

var color = ['#a6c84c','#ffa022','#46bee9'];

var series = [];
function genSeries(dates) {
	dates.forEach(function (item, i) {
	    series.push({
	        //移动的亮点
	        name: item[0] + ' Top5',
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
	        data: convertData(item[1])
	    },
	    {
	        //  线  +  飞机
	        name: item[0] + ' Top5',
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
	        data: convertData2(item[1])
	    },
	    {
	        //国家名字
	        name: item[0] + ' Top5',
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
	            return val[2] ;
	        },
	        itemStyle: {
	            normal: {
	                color: color[i]
	            }
	        },
	
	        data:item[1].data.map(function(dataItem){       //？todo
	            return {
	                name:dataItem.name+":"+dataItem.chineseName+" "+dataItem.sum,
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

option = {
    backgroundColor: '#404a59',
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
        selected:{
            'China Top5':false,
            'USA Top5':false,
        },
        orient: 'vertical',//horizontal
        top: 'bottom',
        left: 'right',
        data:['China Top5', 'USA Top5'],
        textStyle: {
            color: '#fff'
        },

        selectedMode: 'multiple' 									//single    false  multiple	
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
		if (option && typeof option === "object") {
			option.title.text = '世界各国进出口';
			option.title.subtext = '单位：千亿美元';
			genSeries([['China', CNData], ['USA', USAData]]);
			option.legend.data = ['China Top5', 'USA Top5'];
	    	myChart.setOption(option, true);
		}
    },100);
}

//初始化渲染表格数据
var initTable = function(datas) {
	$("#tableDiv").css("padding-right", 0);
	$('#tableContainer').bootstrapTable({
		striped: true,
		cardView: false,
		width:30,
	    columns: [{  
            checkbox: true  
        },{
	        field: 'id',
	        title: '<span class="tabldTitle">世界各国进出口</span>'
	    }],
	    data: datas
	});
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
	$("#tableContainer td").bind("click", function(e){
		var tar = e.target;
		//在这里设置右侧地图的标题
		option.title.text = $(tar)[0].innerText;
		option.title.subtext = '单位：' + $(tar).parent().attr("data-index") + '万亿美元';
		genSeries([['China', CNData], ['USA', USAData]]);
		option.legend.data = ['China Top5', 'USA Top5'];
		myChart.setOption(option, true);
		//alert($(tar).parent().attr("data-index"));
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