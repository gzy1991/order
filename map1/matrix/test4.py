#coding:utf-8
#!/usr/bin/python

import numpy as np
import pandas as pd
import csv, sys
import time
import os
import xlrd
import xlwt
x = np.array(
    [[0, 3,6],
     [4, 5,1],
     [6,1,-3]]
)

y=np.argsort(-x, axis=1)
print x
print y

print y[:,0]
print y[1,:]

a=2.33333
b=4.44444
c=5.55555
d=6.66666
e=7.7777

print round(a,2)
print round(b,2)
print round(c,2)
print round(d,2)
print round(e,2)


# def getArrayFromSheet(excelData,sheetName ):
#     sheet=excelData.sheet_by_name(sheetName)
#     row=sheet.nrows
#     column = sheet.ncols  # 列
#     _array=[]
#     for i in range(0,row):
#         _row=[]
#         for j in range(0, column):
#             _row.append(sheet.cell_value(i,j))
#         _array.append(_row)
#     np_array=np.array(_array)
#     return np_array
#
#
# country_dir='G:\\work\\github\\order\\country_excel\\Countries.xlsx'


# root_add = os.getcwd()
# country_dir = root_add + "\\country_excel\\Countries.xlsx"  # 结果excel所在目录
# excelData = xlrd.open_workbook(country_dir, "rb")
# Country_array = getArrayFromSheet(excelData,u'country')
# print (Country_array[0]).encode("utf-8")


