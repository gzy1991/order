#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import  manage.map6.map6 as map6

import manage.viewsTool as ViewsTool
import importlib,sys
importlib.reload(sys)


#获取图6页面
def getPage(request):
    return render(request, 'map6\map6.html')


#图6 获取表格数据  json格式
def getTableData(request):
    result = map6.getTableData()
    return HttpResponse(result)

#图6 删除数据
def deleteData(request):
    return ViewsTool.deleteData(request, "MAP6_DIR")

# 通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcel (request):
    return ViewsTool.uploadExcel(request, "MAP6_DIR")
