#coding:utf-8
from django.shortcuts import render
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
import map2
import Tool.ExcelTool as ExcelTool

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
    res=ExcelTool.deleteFile("\\file\\map2",fileNameList)
    return HttpResponse("<p>"+res+"</p>")