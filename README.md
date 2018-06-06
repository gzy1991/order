# 1.简介
> 本工程是python web工程，后端采用Django框架，前端主要采用echarts和jQuery. 主要功能为管理excel数据，并将其绘制为相应的图形。

# 图形简介：
>  左侧表格中，每一行都对应一个excel，都可以独立的绘制一张图。

# 1.1 图1
> 展示了世界各国的贸易数据和流动关系，主要展示进口排名前5和出口排名前5的国家，线条粗细与贸易额有关.
<img src="https://github.com/gzy1991/order/blob/master/file/img/map1.png"  alt="图片加载失败时，显示这段字"/>

# 1.2 图2
> 展示了中国境内31个省市自治区（不含港澳台）之间的贸易关系。对于选中的省份，会展示其进口前3或出口前3省份，以及贸易额.
<img src="https://github.com/gzy1991/order/blob/master/file/img/map2.png"  alt="图片加载失败时，显示这段字"/>

# 1.3 图3
> 展示了一定年限内，世界各国GDP、人均GDP以及人均资源消耗之间的关系.
<img src="https://github.com/gzy1991/order/blob/master/file/img/map3.png"  alt="图片加载失败时，显示这段字"/>

# 2.环境安装说明

> Python版本：python 2.7，操作系统win10 X64（win7 64位也可以； 32位系统我测试过win7 32位，也可以正常运行，不过在1.4那里要挑选对应版本的pywin32 .）

> 可能会遇到编码问题，Python2.7编码问题解决方案
https://www.cnblogs.com/kevingrace/p/5893121.html
> pip：参考这里[pip安装指南](https://www.cnblogs.com/rain124/p/6196053.html)

## 2.1 安装 django
```
pip install django==1.11
```
## 2.2 安装 mlab和 numpy
> 参考这里[mlab安装指南](http://blog.csdn.net/sunny_xsc1994/article/details/70197168)

## 2.3 安装 xlrd 和 xlwt
```
pip install xlrd
pip install xlwt
```

## 2.4 安装 Win32com

> 下载包后安装，参照下面链接：
> 1. https://sourceforge.net/projects/pywin32/files/pywin32/Build%20221/
> 2. http://jingyan.baidu.com/article/22fe7ced1ca36b3003617f7a.html


# 3 通过 github 更新代码
[Tutorial](https://www.cnblogs.com/mff520mff/archive/2017/08/13/7355118.html)

# 4 打开页面
```
> 工程启动后，在浏览器中打开
```
- 图1: http://127.0.0.1:8000/matrix/
- 图2：http://127.0.0.1:8000/map2/
- 图2：http://127.0.0.1:8000/map3/

# 5 .m文件说明

> .m文件为matlab执行代码，图1中的计算功能，本质是通过调用.m文件来实现精确计算，并把计算结果写到对应的excel文件中
> （如果通过panda或numpy实现计算功能的话，精度差距太大，所以放弃了）。

|文件|说明|
|:----|:-----|
|map1/matrix/matlab_3.m| 带提示的.m文件|
|map1/matrix/matlab_33.m | 不带提示信息的.m文件|

# 6 echarts版本说明
- 图1使用了echarts3.7.3
- 图2使用了echarts3.7.3
- 图3使用了echarts4.0.1
- 图4使用了echarts3.8.4