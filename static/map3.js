
/**
 * Created by gzy on 2018/1/19
 */

//全局变量


//背景切换所需的数据
var backgroundColor ='#404a59';  //echart背景色

var browserHeight=$(window).height() ; //浏览器高度
$("#tableDiv").height(browserHeight+"px");

//echart全局变量
var dom = document.getElementById("mapContainer");;
var myChart = echarts.init(dom);;
var option = null;
var seriesData =[]; //  容器，存储线的数据
var unit='';  //单位
var unitX='';  //单位 X轴
var unitY='';  //单位 Y轴

var countryShowNum= 50 ; //   显示的国家数目，默认是50
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedSheet;   		//table中选中的那一行 的行数据

var itemStyle = {
        normal: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
    };
    // 计算出气泡半径
 var sizeFunction = function (x) {
        var y = Math.sqrt(x / 5e8) + 0.1;
        return y * 80;
    };
    // Schema:
var schema = [
    {name: 'Country', index: 0, text: '国家', unit: ''}
    ,{name: 'GDP per capita', index: 1, text: '人均GDP', unit: '美元'}
    ,{name: 'Welfare per capita', index: 2, text: '人均消耗', unit: '美元'}

    // {name: 'Income', index: 0, text: '人均收入', unit: '美元'},
    // {name: 'LifeExpectancy', index: 1, text: '人均寿命', unit: '岁'},
    // {name: 'Population', index: 2, text: '总人口', unit: ''},
    // {name: 'Country', index: 3, text: '国家', unit: ''}
];

/* 初始化echart  ,第一次打开页面时或者点击表格行事件时，调用本函数
*  入参：表格的行数据  */
var initEchart=function(row){
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
    option={
        baseOption:{
            timeline: {
                axisType: 'category',
                orient: 'vertical',
                autoPlay: true,
                inverse: true,
                playInterval: 1000,
                left: null,
                right: 0,
                top: 20,
                bottom: 20,
                width: 55,
                height: null,
                label: {
                    normal: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                symbol: 'none',
                lineStyle: {
                    color: '#555'
                },
                checkpointStyle: {
                    color: '#bbb',
                    borderColor: '#777',
                    borderWidth: 2
                },
                controlStyle: {
                    showNextBtn: false,
                    showPrevBtn: false,
                    normal: {
                        color: '#666',
                        borderColor: '#666'
                    },
                    emphasis: {
                        color: '#aaa',
                        borderColor: '#aaa'
                    }
                },
                data: []
            },
        }

    }

    myChart = echarts.init(dom);

    //绑定 年份切换时间=
    myChart.on('timelinechanged', function (params) {
        console.log(params);


        myChart.setOption(option,true);

    });


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
			url:"/deleteDataInMap3",
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
        url:"/initMap3",
        success:function (data) {
	        console.log(" initMap3 扫描成功");
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



















