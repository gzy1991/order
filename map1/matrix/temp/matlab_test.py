#coding:utf-8
#!/usr/bin/python

# 测试
# http://blog.csdn.net/pinellina/article/details/50789209


import time

########################################################################
#######################测试成功 本方法可行# ###########################
# from mlab.releases import latest_release
# from matlab import matlabroot
# import os
# print matlabroot()
# from mlab.releases import latest_release as matlab
#
# pwd = os.getcwd()
# matlab.path(matlab.path(),pwd)
# print matlab.path()
# r=matlab.test7()
# print r

########################################################################
# from mlab.releases import latest_release
# from matlab import matlabroot
# import os
# print matlabroot()
# from mlab.releases import latest_release as matlab
#
# pwd = os.getcwd()
# matlab.path(matlab.path(),pwd)
# print matlab.path()
#
# def calculate(FD_add,E_add,T_add,result_name,unit):
#     print '调用开始！', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
#     T_addList = T_add.split('\\')
#     T_add_index=T_add.replace(T_addList[len(T_addList)-1],'')
#     result_name=T_add_index+result_name+'.xls'   #结果数据的名字
#     matlab.matlab_3(FD_add,E_add,T_add, result_name)
#     print '调用结束！', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
#     return "计算成功！"
# resultString = calculate("G:\work\matlab_test\FD.csv", "G:\work\matlab_test\E_1.csv", "G:\work\matlab_test\data.csv","temp_-176000_1127","")
# print(resultString)

########################################################################
# from mlab.releases import latest_release as matlab
# import os
#
# matlab.path(matlab.path(), pwd = os.getcwd())  # 设置路径
# def mainFunction():
#     a = 1
#     b = 2
#     matlab.test7(a, b) # 调用matlab的函数
#
#
# if __name__ == '__main__':
#     print 'running...'
#     mainFunction()
########################################################################
# from win32com.client import Dispatch
# h = Dispatch("Matlab.application")#启动MATLAB自动化服务器
# h.execute("test7(2,3)")
# print("end")


########################################################################
#######################测试成功  本方法可行################################
import time
import os
import pythoncom
from mlab.releases import latest_release as matlab
from matlab import matlabroot
import win32com.client
from win32com.client import Dispatch

def calculate(FD_add,E_add,T_add,result_name,unit):
    print ('调用开始！', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
    pythoncom.CoInitialize()
    print (matlabroot())
    pwd = os.getcwd()
    matlab.path(matlab.path(), pwd)  # 设置路径
    print (matlab.path())
    T_addList = T_add.split('\\')
    T_add_index = T_add.replace(T_addList[len(T_addList) - 1], '')
    result_name = T_add_index + result_name + '.xls'  # 结果数据的名字
    h = Dispatch("Matlab.application")
    h.execute("test8('"+FD_add+"','"+E_add+"','"+T_add+"','"+result_name+"')")
    #h.execute("matlab_3('"+FD_add+"','"+E_add+"','"+T_add+"','"+result_name+"')")
    print ('调用结束！', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
    return result_name
resultString = calculate("G:\work\matlab\FD.csv", "G:\work\matlab\E_1.csv", "G:\work\matlab\data.csv","temp_-176000_1127","")
print('计算成功'+resultString)

########################################################################