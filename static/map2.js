/**
 * Created by  on 2018/1/19
 */

//全局变量

//背景切换所需的数据
var backgroundColor ='#404a59';  //echart背景色
var color=[]
var areaColor ='#323c48'; //地图区域的颜色
var emphasisAreaColor='#2a333d';   //选中省份时，背景色
var textColor='#fff';
var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();		//浏览器宽度
$("#tableDiv").height(browserHeight+"px");

var geoTextColor="#fff"; //地图上，选中国家时，国家名的颜色
//标签切换所需的数据
var isShowSign=true;  //是否显示标签 ，初始化的时候显示

//echart全局变量
var datas ;
var dom = document.getElementById("mapContainer");;
var myChart;
var app = {};
var option = null;
var series ;
var unit='';  //单位
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
		'新疆': "Xinjiang",		'云南': "Yunnan",		'上海': "Shanghai",				'浙江': "Zhejiang"	
	};

var geoData=[ // 选中的省份,初始化的时候是空
							{name:'Guangdong', selected:true},
                          	{name:'Beijing', selected:true},
							{name:'Ningxia', selected:true},
                          	{name:'Jiangsu', selected:true},
                          	{name:'陕西', selected:true},
                          	{name:'河南', selected:true},
                          	{name:'福建', selected:true}
];

/* 初始化echart  ,第一次打开页面时、点击表格行事件时，调用本函数
*  入参：行数据  */
var initEchart = function(row){
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

	option = {
	  	tooltip: {
	      	trigger: 'item',
	      	formatter: '{b}'
	  	},
	  	geo: {

	      	show:true,
	      	map: 'china',
	      	label: {
	        	emphasis: {
	            show: false
	        	}
	      	},
	        selectedMode : 'multiple',
	        roam: true,
		    selected:true,
		    //nameMap: nameMap,
		    itemStyle: {
		        normal: {
		           /* areaColor: '#323c48',
		            borderColor: '#404a59'*/
		        },
		        emphasis: {
		            /*areaColor: '#2a333d'*/
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
	    },
	};

	myChart.setOption(option, true);

}



//初始化渲染表格数据
var initTable = function(datas){
	$("#tableDiv").css("padding-right", 0);
	//先销毁表格
	$('#tableContainer').bootstrapTable('destroy');
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

//窗体改变时触发
window.onresize = function(){
	adjustScrollPage();
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

//切换标签
var switchSignBtn =function(){
	if(isShowSign){   //如果已经显示标签，那么切换为不显示
		isShowSign=false;
	}else{
		isShowSign=true;
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
