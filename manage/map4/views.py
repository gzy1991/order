#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import map4

import manage.viewsTool as ViewsTool
import sys
reload(sys)
sys.setdefaultencoding("utf-8")



#获取图4页面
def getPage2(request):
    return render(request, 'map4_test.html')

#获取图4页面
def getPage(request):
    return render(request, 'map4.html')

#图4 获取表格数据  json格式
def getTableData(request):
    result = map4.getTableData()
    return HttpResponse(result)

#图4 删除数据
def deleteData(request):
    ViewsTool.deleteData(request, "MAP4_DIR")

# 通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcel (request):
    ViewsTool.uploadExcel(request, "MAP4_DIR")
