#coding:utf-8
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import map2
import Tool.ExcelTool as ExcelTool
import order.settings as Setting
import os
import json
#获取图2页面
def getPage(request):
    return render(request, 'map2_china.html')

#图2 表格数据  json格式
def getTableData(request):
    result =map2.getTableData()
    return  HttpResponse(result)

#图2 删除数据
def deleteDataInMap2(request):
    fileNameList = request.GET.get("fileNameList").encode("utf-8")
    res=ExcelTool.deleteFile(Setting.FILR_DIR["MAP2_DIR"],fileNameList)
    return HttpResponse("<p>"+res+"</p>")

# 通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcelInMap2 (request):
    result = {"result": "true","message":"上传成功!"}
    excelDir=Setting.FILR_DIR["MAP2_DIR"]
    try:
        response = HttpResponse()
        if request.FILES.has_key("excelFile"):
            ExcelUpload = request.FILES['excelFile']
            name=ExcelUpload.name.encode("utf-8") #文件名
            #name=ExcelUpload.name.encode("gbk") #文件名
            result["message"]= name+"上传成功!"
            excelAddress=os.path.join(excelDir,name) #
            if os.path.exists(excelAddress):  #重名
                result["result"] = "false"
                result["message"] = name+"上传失败，文件名重复，请修改文件名!"
            else:
                with open(excelAddress,'wb+') as destination:  #保存excel到对应位置
                    for chunk in ExcelUpload.chunks():
                        destination.write(chunk)
        print result
        return  HttpResponse(json.dumps(result))
    except Exception:
        result["result"]="false"
        result["message"]=name+"上传失败，请联系管理员!"
        return JsonResponse(json.dumps(result))

