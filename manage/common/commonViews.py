#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import order.settings as Setting
import Tool.ExcelTool as ExcelTool
import importlib,sys
importlib.reload(sys)


#   公共工具：删除数据
#   mapDir：  要删除的文件所属类型
#   fileNameList：要删除的文件名列表
def deleteData(request):
    mapDir = request.GET.get("mapDir")
    fileNameList = request.GET.get("fileNameList")
    res = ExcelTool.deleteFile(Setting.FILR_DIR[mapDir], fileNameList)
    return  HttpResponse(res)