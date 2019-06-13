#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
import  manage.map5.map5 as map5

import manage.viewsTool as ViewsTool
import importlib,sys
importlib.reload(sys)





#获取图5页面
def getPage(request):
    return render(request, 'map5.html')

#图5 获取表格数据  json格式
def getTableData(request):
    result = map5.getTableData()
    return HttpResponse(result)

#图5 删除数据
def deleteData(request):
    return ViewsTool.deleteData(request, "MAP5_DIR")

# 通过bootstrap fileinput 上传excel,保存到服务器上
def uploadExcel (request):
    return ViewsTool.uploadExcel(request, "MAP5_DIR")
