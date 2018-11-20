#coding:utf-8
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,JsonResponse

import Tool.ExcelTool as ExcelTool
import order.settings as Setting
import os
import json
import manage.viewsTool as ViewsTool
#获取首页页面
def getPage(request):
    return render(request, 'homePage/homePage.html')