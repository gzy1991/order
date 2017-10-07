#coding:utf-8

from numpy import *
import numpy as np
import pandas as pd
import csv, sys
import time
import xlwt

import os
# print time.localtime(time.time())
print '调用开始！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
# a=[[8 ,    6  ,   9,     9],
#    [9  ,   0  ,   9   ,  4],
#    [1   ,  2    , 1   ,  8],
#    [9   ,  5  ,   9    , 1]]
#
# b= np.array(a)
# c=np.linalg.pinv(b)
# print(c)

# matlab代码
# A=[8 6 9 9 ;9 0 9 4 ;1 2 1 8;9 5 9 1]


# from mlab.releases import latest_release as matlab
# from matlab import matlabroot
#
# pwd = os.getcwd()
# print matlabroot()
# matlab.path(matlab.path(), pwd)  # 设置路径
# print matlabroot()


#
# from win32com.client import Dispatch
# h = Dispatch("Matlab.application")
# sum = h.execute("test_sum(1,2)") #执行test函数，给定两个量(1,2)
# print sum


from mlab.releases import latest_release as matlab
from matlab import matlabroot
print matlabroot()
# sum =matlab.test_sum(1,3)
# print sum

matlab.matlab_3("G:\work\matlab_test\FD.csv", "G:\work\matlab_test\E_1060.csv", "G:\work\matlab_test\data.csv",
                  "temp_1060")
print '调用结束！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))