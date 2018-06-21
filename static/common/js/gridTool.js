/**
 * Created by gzy on 2018/5/13.
 */


/*
* 公共函数，
* 用来处理表格的一些操作，
* */

//删除表格行
    /*
    * tableContainer     :表格容器 ID
    * deleteResult      :处理结果显示容器id
    * deleteModel       ：模态框ID
    * url               :后台删除功能接口
    * callback          :回调函数
    * */
var delBtnFn = function(tableContainer,deleteResult,deleteModel,url,callback) {
	$("#"+deleteResult).html("正在删除数据，请稍候...");
	var selectedData= $('#'+tableContainer).bootstrapTable('getSelections');
	if(typeof selectedData === null || selectedData.length == 0) {
		$.Message.popup("提示", "请选中要删除的数据!");
		return;
	}
	$('#'+deleteModel).modal('show');
	$('#'+deleteModel).on('shown.bs.modal', function () {
		var data='';
		$.each(selectedData, function(i, item) {
			data=data+','+item.fullFileName;
		});
		data=data.substring(1,data.length)
		$.ajax({
			type:"GET",
			async:true,
			url:url,
			data:{fileNameList:data},
			success:function(data){
				callback();
				$("#"+deleteResult).html(data);
			}
		});
    });
}