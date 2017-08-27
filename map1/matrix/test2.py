#coding:utf-8

from numpy import *
import numpy as np
import pandas as pd
import csv, sys
import time
import xlwt


print time.localtime(time.time())
print '调用开始！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
a=[[8 ,    6  ,   9,     9],
   [9  ,   0  ,   9   ,  4],
   [1   ,  2    , 1   ,  8],
   [9   ,  5  ,   9    , 1]]

b= np.array(a)
c=np.linalg.pinv(b)
print(c)

# matlab代码
# A=[8 6 9 9 ;9 0 9 4 ;1 2 1 8;9 5 9 1]