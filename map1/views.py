#coding:utf-8
from django.shortcuts import render


from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from matrix.python_matlab import calculate as cal
from matrix.rank import rank_result as rank_result
from matrix.deleteData import deleteData as deletefile

#图1 页面
def map1(request):
    return render(request, 'map1.html')
#图1  计算
def calculate(request):
    title=request.GET.get("title").encode("utf-8")
    fd_address=request.GET.get("fd_address").encode("utf-8")
    e_address=request.GET.get("e_address").encode("utf-8")
    t_address=request.GET.get("t_address").encode("utf-8")
    unit=request.GET.get("unit").encode("utf-8")
    resultString= cal(fd_address, e_address, t_address,
                              title, unit)
    print "resultString:" + resultString
    if resultString.find("失败") !=-1:
        resultString="<p>  "+resultString+"</p>"
    else:
        resultString="<p> 计算成功，导出文件路径为： "+resultString+"</p>"
    return  HttpResponse(resultString)
# 图1  排序，初始化页面时，获取表格数据
def rank(request):
    result_list_json=rank_result()
    return HttpResponse(result_list_json)

# 返回一个页面
def index(request):
    return render_to_response("index.html")


#图1 删除数据
def deleteData(request):
    fileNameList = request.GET.get("fileNameList").encode("utf-8")
    res=deletefile(fileNameList)
    return HttpResponse("<p>"+res+"</p>")

