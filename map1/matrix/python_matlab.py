#coding:utf-8
#!/usr/bin/python
# python调用matlab
# 计算模块：调用用matlab的api执行.m文件，
# 入参：
# 执行结果：


import time

from mlab.releases import latest_release
from matlab import matlabroot
# import win32com.client
#
# from win32com.client import Dispatch
import os
import xlwt
import pythoncom

#
def calculate(FD_add,E_add,T_add,result_name):
    # print FD_add,E_add,T_add,result_name
    pythoncom.CoInitialize()
    print matlabroot()
    pwd = os.getcwd()

    T_addList=T_add.split('\\')
    T_add_index=T_add.replace(T_addList[len(T_addList)-1],'')
    result_name=T_add_index+result_name+'.xls'   #结果数据的名字

    print '调用开始！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    matlab.path(matlab.path(), pwd)  # 设置路径
    # matlab.matlab_3(FD_add,E_add,T_add, result_name)

    # matlab.test66(FD_add, E_add, T_add, result_name)

    h = Dispatch("Matlab.application")
    # h.execute("test(0.0,512.0)")  # 执行matlab_1 函数，给定两个量
    h.execute("test66(FD_add, E_add, T_add, result_name)")  # 执行matlab_1 函数，给定两个量
    # h.execute("matlab_2()")  # 执行matlab_1 函数，给定两个量

    print '调用结束！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))

    time.sleep(5) #延迟5秒
    pass

    return result_name



# if __name__ == '__main__':
#     print "matlab运行路径", matlabroot()
#     pwd = os.getcwd()
#     FD_add='G:\work\matlab\FD.csv'
#     E_add='G:\work\matlab\E_1.csv'
#     T_add='G:\work\matlab\data.csv'
#     result_name = 'hello23ff__3'            #前台传入的字符串，字母数字集合，不要用汉字，会输出乱码，校验不带特殊字符：
#
#     T_addList=T_add.split('\\')
#     T_add_index=T_add.replace(T_addList[len(T_addList)-1],'')
#     result_name=T_add_index+result_name+'.xls'   #结果数据的名字
#
#     # h = Dispatch("Matlab.application")
#     print '调用开始！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
#     # h.execute("test(0.0,512.0)")  # 执行matlab_1 函数，给定两个量
#     # h.execute("matlab_2()")  # 执行matlab_1 函数，给定两个量
#     matlab.path(matlab.path(), pwd)  # 设置路径
#     # matlab.test66(FD_add,E_add,T_add, result_name)
#     matlab.matlab_3(FD_add,E_add,T_add, result_name)
#     print '调用结束！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
#
#     time.sleep(5) #延迟5秒
#
#     pass



