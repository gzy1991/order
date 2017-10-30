#coding:utf-8
from django.shortcuts import render


from django.shortcuts import render,render_to_response
# Create your views here.
import  sys
import datetime
import pymysql
from django.http import HttpResponse
import os
from django.http import HttpResponse
from matrix.python_matlab import calculate as cal
from matrix.rank import rank_result as rank_result


# def map1(request):
#
#     return render(request, 'echarts.html')
#
# def map2(request):
#
#     return render(request, 'echarts2.html')

def map3(request):

    return render(request, 'views/map1.html')
def calculate(request):
    # res=cal('1','2','3','4')
    result_name=cal("G:\work\matlab_test\FD.csv", "G:\work\matlab_test\E_1.csv" , "G:\work\matlab_test\data.csv", "temp_-176000")
    return  HttpResponse("<h1>  "+result_name+"+ </h1>")

def rank(request):
    result_list_json=rank_result()
    return HttpResponse(result_list_json)

#
# def hi(request):
#     return HttpResponse("<h1>hello world</h1h>")

#返回一个页面
def index(request):
    return render_to_response("index.html")

# #返回一张图片
# def my_image(request):
#     image_data = open("view/static/picture/247193-106.jpg", "rb").read()
#     return HttpResponse(image_data, content_type="image/jpg")       #  mimetype  content_type
