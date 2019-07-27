#coding:utf-8
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse

#获取首页页面
def getPage(request):
    return render(request, 'homePage/homePage.html')