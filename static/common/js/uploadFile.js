/**
 * Created by gzy on 2018/5/11.
 */



/*初始化上传组件*/
var initUpload = function(ctrlName, uploadUrl,addButtonResult){
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
		$("#"+addButtonResult).append("<p>"+data.response.message+"<p>");
		if("true"==data.response.result){ //刷新表格
			refBtnFn();
		}else if ("false"==data.response.result){
			//不操作
		}
	 });
}