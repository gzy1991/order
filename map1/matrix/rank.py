#coding:utf-8
#!/usr/bin/python

# 批量读取结果文件，排序，
import os
import  sys
import numpy as np
import pandas as pd
import xlrd

result_address='G:\\work\\github\\order\\result'
# def file_name(file_dir):
#     for root, dirs, files in os.walk(file_dir):
#         print(root) #当前目录路径
#         print(dirs) #当前路径下所有子目录
#         print(files) #当前路径下所有非目录子文件

def rank():
    files = file_name(result_address)
    print files  # .xlsx结果文件

    for file in files:  #批量读取
        data = xlrd.open_workbook('file')
        T4  = data.sheet_by_name(u'T4')    # 通过名称获取
        FD4 = data.sheet_by_name(u'FD4')  # 通过名称获取
        Tra = data.sheet_by_name(u'Tra')  # 通过名称获取
        FD_ = data.sheet_by_name(u'FD_')  # 通过名称获取



    return

# def listdir(path, list_name):
#     for file in os.listdir(path):
#         file_path = os.path.join(path, file)
#         if os.path.isdir(file_path):
#             listdir(file_path, list_name)
#         elif os.path.splitext(file_path)[1]=='.jpeg':
#             list_name.append(file_path)

def file_name(file_dir):
    L=[]
    for root, dirs, files in os.walk(file_dir):
        for file in files:
            if os.path.splitext(file)[1] == '.xlsx':
                L.append(os.path.join(root, file))
    return L


rank()