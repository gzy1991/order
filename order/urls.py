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

import  map1.views as map1
import  manage.map2.views  as map2
import  manage.map3.views  as map3
import  manage.map4.views  as map4

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    #公共资源
    #url(r'^header/$',map1.getHeader),  # 获取导航栏 header.html

    #图1
    url(r'^matrix/$',map1.map1),  #图1 页面
    url(r'^calculate/$',map1.calculate),    #图1
    url(r'^rank/$',map1.rank),
    url(r'^deleteData/$',map1.deleteData),
    url('^index/$', map1.index),

    #图2
    url(r'^map2/$',map2.getPage),  # 图2页面
    url(r'^initMap2/$',map2.getTableData),  # 图2数据
    url(r'^deleteDataInMap2/$',map2.deleteDataInMap2),  #删除
    url(r'^uploadExcelInMap2$',map2.uploadExcelInMap2)  #新增

    #图3
    , url(r'^nengyuanju/$',map3.nengyuanju)             #示例
    , url(r'^map3/$',map3.getPage)                      #获取页面
    , url(r'^initMap3/$',map3.getTableData)                  #获取页面数据，初始化页面
    , url(r'^deleteDataInMap3/$',map3.deleteData)          #删除
    , url(r'^uploadExcelInMap3$/$',map3.uploadExcel)        #新增

    #图4
    , url(r'^map4/$',map4.getPage)                      #获取页面
    , url(r'^initMap4/$',map4.getTableData)                  #获取页面数据，初始化页面
    , url(r'^deleteDataInMap4/$',map4.deleteData)          #删除
    , url(r'^uploadExcelInMap4$/$',map4.uploadExcel)        #新增


]
