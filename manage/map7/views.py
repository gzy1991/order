#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import  manage.map7.map7 as map7

import manage.viewsTool as ViewsTool
import importlib,sys
importlib.reload(sys)


#获取页面
def getPageTest(request):
    result = map7.getTableData()
    return render(request, 'map7/map7test.html')

#获取页面
def getPage(request):
    return render(request, 'map7/map7.html')

#7 获取表格数据  json格式
def getTableData(request):
    result = map7.getTableData()
    return HttpResponse(result)

# 删除数据
def deleteData(request):
    return ViewsTool.deleteData(request, "MAP7_DIR")

# 新增数据：通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcel (request):
    return ViewsTool.uploadExcel(request, "MAP7_DIR")
