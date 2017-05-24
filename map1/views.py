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

