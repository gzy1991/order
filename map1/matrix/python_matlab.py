#coding:utf-8
#!/usr/bin/python
# python调用matlab
# 计算模块：调用用matlab的api执行.m文件，
# 入参：
# 执行结果：


#
# result_name  导出文件的名字
# unit  单位

def calculate(FD_add,E_add,T_add,result_name,unit):
    import time
    import os
    import pythoncom
    from mlab.releases import latest_release as matlab
    from matlab import matlabroot
    import win32com.client
    from win32com.client import Dispatch

    root_add = os.getcwd()
    #print(os.getcwd())  # 获取工程根目录
    file_dir = root_add + "\\file\\map1_result_excel\\"  # 结果excel所在目录
    result_name = file_dir + result_name + '.xls'  # 结果数据的名字
    #判断 文件名是否已存在
    if os.path.exists(result_name):
        return "计算失败，主题重复，请修改主题！"

    print '调用开始！', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    pythoncom.CoInitialize()
    #print "matlabroot():"+matlabroot()
    matlab.path(matlab.path(), root_add+"\\map1\\matrix")  # 设置路径
    #print "matlab.path():"+matlab.path()
    T_addList = T_add.split('\\')
    T_add_index = T_add.replace(T_addList[len(T_addList) - 1], '')


    h = Dispatch("Matlab.application")
    h.execute("matlab_3('" + FD_add + "','" + E_add + "','" + T_add + "','" + result_name + "','"+ unit+"')")
    print '调用结束！', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    return result_name















