#coding:utf-8
#!/usr/bin/python

#  图4
#  获得table数据， json格式,
#

import os
import  sys
import xlrd
import xlwt
import numpy as np
import json
import Tool.ExcelTool as ExcelTool
import order.settings as Setting


#   关于本图中excel的格式规则


#获得table数据 ，json格式,
def getTableData():
    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP3_DIR"])
    print files             # .xlsx结果文件列表
    resultList = []         # 全部excel文件处理后的结果，容器
    errMsg = ""             # 错误信息

    for file in files:      # 遍历每个excel文件
        try:
            result = {}  # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName  # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]  # 文件全名 （不带后缀）
            print file + " start"

            excelData = xlrd.open_workbook(file, "rb")




        except BaseException:
            print "Error: 文件有问题: " + file
            print BaseException
            errMsg += file + "<br/>"

    resultListJson = json.dumps(resultList)
    print "Map4返回值 resultListJson :"
    print   resultListJson
    return






