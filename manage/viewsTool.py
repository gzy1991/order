#coding:utf-8
#!/usr/bin/python

import Tool.ExcelTool as ExcelTool
import order.settings as Setting
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import json

# 公共views工具，提供文件删除功能、文件上传功能



#   公共工具：删除数据
#   dir : 文件所在的路径
def deleteData(request,dir):
    fileNameList = request.GET.get("fileNameList").encode("utf-8")
    res=ExcelTool.deleteFile(Setting.FILR_DIR[dir],fileNameList)
    return HttpResponse("<p>"+res+"</p>")

#   公共工具： 通过bootstrap fileinput 上传excel, 并保存到服务器上
#   dir : 存储文件的路径
def uploadExcel (request,dir):
    result = {"result": "true","message":"上传成功!"}
    excelDir=Setting.FILR_DIR[dir]
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