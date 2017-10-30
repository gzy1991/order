#coding:utf-8
"""order URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from  map1.views import *

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # url(r'^map1/$',map1),  #测试
    # url(r'^map2/$',map2),  #dialog
    url(r'^map3/$',map3),  #主页面
    url(r'^calculate/$',calculate),
    # url('^my_image/$',my_image),
    # url('^hi/$',hi),
    url('^rank/$',rank),


    url('^index/$',index)
]
