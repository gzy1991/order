#coding:utf-8
#!/usr/bin/python

# excel文件操作工具类
# 依赖    xlrd、xlwt、 numpy
import os
import  sys
import xlrd
import xlwt
import numpy as np



# 从根目录下读取指定的excel数据
def getArrayBySheetName(excelDir,sheetName):
    root_add = os.getcwd()
    #fileDir = root_add + "\\country_excel\\Countries.xlsx"  #  excel所在目录
    fileDir = root_add + excelDir  #  excel所在目录
    excelData = xlrd.open_workbook(fileDir, "rb")
    Country_array = getArrayFromSheet(excelData,sheetName,'name')
    return Country_array

# 读取根目录下制定的excel数据
def getArrayBySheetIndex(excelDir,index):
    root_add = os.getcwd()
    #fileDir = root_add + "\\country_excel\\Countries.xlsx"  #  excel所在目录
    fileDir = root_add + excelDir  #  excel所在目录
    excelData = xlrd.open_workbook(fileDir, "rb")
    Country_array = getArrayFromSheet(excelData,index,'index')
    return Country_array


# 根据sheetName或者sheetIndex从excel获取sheet， 转化成 numpy.array
# excelData: excel数据
# type:      "name" 或"index"
# param   :sheet的索引或名称
def getArrayFromSheet(excelData,param ,type):
    if(type=='index'):
        sheet = excelData.sheet_by_index(param)
    elif(type=='name'):
        sheet=excelData.sheet_by_name(param)
    row=sheet.nrows
    column = sheet.ncols  # 列
    _array=[]
    for i in range(0,row):
        _row=[]
        for j in range(0, column):
            _row.append(sheet.cell_value(i,j))
        _array.append(_row)
    np_array=np.array(_array)
    return np_array



#  获取根目录下，指定目录中 excel文件的地址列表  ，只获取xls和xlsx文件
# dir: 指定的目录
def listExcelFile( dir ):
    res=[]
    root_add=os.getcwd()
    print(os.getcwd())                       # 获取工程根目录
    file_dir=root_add+"\\excel_map2"     #  结果excel所在目录
    file_dir=root_add+dir     #  结果excel所在目录
    for root, dirs, files in os.walk(file_dir):
        for file in files:
            try:
                if os.path.splitext(file)[1] == '.xlsx' or  os.path.splitext(file)[1] == '.xls':
                    res.append(os.path.join(root, file))
            except BaseException:
                print "Error:！文件读取失败：" + file
    return res











