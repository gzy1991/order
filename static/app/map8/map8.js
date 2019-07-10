/*
*   Created by gzy on 2019年6月24日
* */

/*地图全局数据*/
var datas ; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var widewsPercentage=[30,30];       //存储窗体当前的左右比例    初始化,左边是 30%  。记录两个30，是因为点击缩放按钮的时候，需要记录点击之前的比例和点击之后的比例。
var leftMinWidth = $("#buttonArea").width()+$("#hideList").width()+$("#h-handler").width();//左侧按钮区的最小宽度
var MinPercentage = 0.3 ;//窗体左右比例的最小值，默认是0.3，打开页面的时候，要初始化
/*计算窗体左右比例的最小值*/
var calculateMinPercentage = function(){
    //  比例= 左边按钮区的宽度/整体宽度
    MinPercentage = leftMinWidth/$(window).width() ;
    MinPercentage = Math.ceil(MinPercentage*100)/100 ;//舍去小数点后两位后面的数据
}

initFrame(
    "mainContainer",
    "tableContainer",
    "operationBtnGroup",
    "hideBtn",
    "dataTable",
    "h-handler",
    "echartsContainer",
    "dataEcharts"
);



