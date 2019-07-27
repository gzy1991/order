#coding:utf-8
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import manage.map2.map2 as map2
import Tool.ExcelTool as ExcelTool
import order.settings as Setting
import os
import json
import manage.viewsTool as ViewsTool
#获取图2页面
def getPage(request):
    return render(request, 'map2_china.html')

#图2 表格数据  json格式
def getTableData(request):
    result =map2.getTableData()
    return  HttpResponse(result)

#图2 删除数据
def deleteDataInMap2(request):
    return ViewsTool.deleteData(request,"MAP2_DIR")

# 通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcelInMap2 (request):
    return ViewsTool.uploadExcel(request,"MAP2_DIR")


