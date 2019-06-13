#coding:utf-8
#!/usr/bin/python

from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import  manage.map3.map3 as map3
import Tool.ExcelTool as ExcelTool
import order.settings as Setting
import os
import json
import manage.viewsTool as ViewsTool

import importlib,sys
importlib.reload(sys)





def nengyuanju(request):
    return render(request, 'nengyuanju.html')

#获取图3页面
def getPage(request):
    return render(request, 'map3_suo.html')

#图3 获取表格数据  json格式
def getTableData(request):
    result = map3.getTableData()
    return HttpResponse(result)

#图3 删除数据
def deleteData(request):
    return ViewsTool.deleteData(request, "MAP3_DIR")

# 通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcel (request):
    return ViewsTool.uploadExcel(request, "MAP3_DIR")
