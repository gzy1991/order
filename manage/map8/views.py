#coding:utf-8
#!/usr/bin/python
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse
# import  manage.map7.map7 as map7

import manage.viewsTool as ViewsTool
import importlib,sys
importlib.reload(sys)



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