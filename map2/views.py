#coding:utf-8
from django.shortcuts import render
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
import map2

#获取图2页面
def getPage(request):
    return render(request, 'map2.html')

#图2 表格数据  json格式
def getTableData(request):
    result =map2.getTableData()
    return result

