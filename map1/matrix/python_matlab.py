#coding:utf-8
#!/usr/bin/python
# python调用matlab

import matlab
import matlab.engine
import time
from mlab.releases import latest_release as matlab
from matlab import matlabroot
import win32com.client
import os
from win32com.client import Dispatch
from mlab.releases import latest_release as matlab
import xlwt
if __name__ == '__main__':
    print "matlab运行路径", matlabroot()
    pwd = os.getcwd()
    FD_add='G:\work\matlab\FD.csv'
    E_add='G:\work\matlab\E_1.csv'
    T_add='G:\work\matlab\data.csv'
    result_name = 'hello23ff__3'            #前台传入的字符串，字母数字集合，不要用汉字，会输出乱码，校验不带特殊字符：

    T_addList=T_add.split('\\')
    T_add_index=T_add.replace(T_addList[len(T_addList)-1],'')
    result_name=T_add_index+result_name+'.xls'   #结果数据的名字



    # h = Dispatch("Matlab.application")
    print '调用开始！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    # h.execute("test(0.0,512.0)")  # 执行matlab_1 函数，给定两个量
    # h.execute("matlab_2()")  # 执行matlab_1 函数，给定两个量
    matlab.path(matlab.path(), pwd)  # 设置路径
    # matlab.test66(FD_add,E_add,T_add, result_name)
    matlab.matlab_3(FD_add,E_add,T_add, result_name)
    print '调用结束！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))

    time.sleep(5) #延迟5秒
    # eng = matlab.engine.start_matlab('MATLAB_\R2016b')
    # a = eng.sqrt(9.0)
    # print type(a), a
    #
    #
    # A = matlab.double([[8, 6, 9, 9], [9, 0, 9, 4,],[1, 2, 1, 8],[9, 5, 9, 1]])
    # print(A)
    # B = eng.pinv(A)
    # print(B)
    # eng.quit()
    pass

# a=[[8 ,    6  ,   9,     9],
#    [9  ,   0  ,   9   ,  4],
#    [1   ,  2    , 1   ,  8],
#    [9   ,  5  ,   9    , 1]]
#
# b= np.array(a)
# c=np.linalg.pinv(b)
# print(c)


