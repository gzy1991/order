#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
# import  manage.map7.map7 as map7

import manage.viewsTool as ViewsTool
import importlib,sys
importlib.reload(sys)
import  manage.map8.map8 as map8


#获取页面
def getPage(request):
    # result = map8.getTableData()
    return render(request, 'map8/map8.html')

#获取测试页面
def getPageTest(request):
    # result = map8.getTableData()
    return render(request, 'map8/test1.html')

#获取测试页面
def getPageTest2(request):
    # result = map8.getTableData()
    return render(request, 'map8/test2.html')

#获取测试页面
def getPageTest3(request):
    # result = map8.getTableData()
    return render(request, 'map8/test3.html')

#获取测试页面
def getPageTest4(request):
    # result = map8.getTableData()
    return render(request, 'map8/test4.html')

#7 获取表格数据  json格式
def getTableData(request):
    result = map8.getTableData()
    return HttpResponse(result)

# 删除数据
def deleteData(request):
    return ViewsTool.deleteData(request, "MAP8_DIR")

# 新增数据：通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcel (request):
    return ViewsTool.uploadExcel(request, "MAP8_DIR")








