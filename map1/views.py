from django.shortcuts import render


from django.shortcuts import render,render_to_response
# Create your views here.
import datetime
import pymysql
from django.http import HttpResponse
import os
from django.http import HttpResponse


def map1(request):

    return render(request, 'echarts.html')

def map2(request):

    return render(request, 'echarts2.html')

def map3(request):

    return render(request, 'echarts3.html')
