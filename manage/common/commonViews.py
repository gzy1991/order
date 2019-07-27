#coding:utf-8
#!/usr/bin/python

from django.http import HttpResponse,JsonResponse
import order.settings as Setting
import Tool.ExcelTool as ExcelTool
import importlib,sys
import os
import os.path
importlib.reload(sys)


#   公共工具：删除数据
#   mapDir：  要删除的文件所属类型
#   fileNameList：要删除的文件名列表
def deleteData(request):
    mapDir = request.GET.get("mapDir")
    fileNameList = request.GET.get("fileNameList")
    res = ExcelTool.deleteFile(Setting.FILR_DIR[mapDir], fileNameList)
    return  HttpResponse(res)

#   公共工具：新增数据
#   mapDir：  要删除的文件所属类型
#   fileNameList：要删除的文件名列表
def uploadData(request):
    mapDir = request.POST.get("mapDir")
    excelDir=Setting.FILR_DIR[mapDir]
    result = {"result": "true", "message": "上传成功!"}
    try:
        response = HttpResponse()
        if "excelFile" in  request.FILES :
            ExcelUpload = request.FILES['excelFile']
            name=ExcelUpload.name #文件名
            result["message"]= name+"上传成功!"
            excelAddress=os.path.join(excelDir,name) #
            if os.path.exists(excelAddress):  #重名
                result["result"] = "false"
                result["message"] = name+"上传失败，文件名重复，请修改文件名!"
            else:
                with open(excelAddress,'wb+') as destination:  #保存excel到对应位置
                    for chunk in ExcelUpload.chunks():
                        destination.write(chunk)
        print (result)
        return  JsonResponse(result)
    except Exception:
        result["result"]="false"
        result["message"]=name+"上传失败，请联系管理员!"
        return JsonResponse(result)
