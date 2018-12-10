#coding:utf-8
#!/usr/bin/python

#  图7
#  获得table数据， json格式,
#

import traceback
import os
import  sys
import xlrd
import xlwt
import numpy as np
import json
import Tool.ExcelTool as ExcelTool
import order.settings as Setting
import Tool.country as CountrySwitchName
import Tool.BrRegion  as SubCountrys

#   关于本图中excel的格式规则
#   n个 189*189 矩阵   ，记录的是中间数据
#   1个sheet ，sheet名字是"Unit"，记录的是单位，里面有n个单位
#
#   注意：不同的excel里面，n可能是不同的，n要动态获取

def getTableData():
    countryNum = 189  # 全部国家总数  189个国家
    provinceNum = 31  # 中国的31个省市自治区，不处理港澳台
    # 获取省份名列表，包括 ： 中文名、英文名、纬度、经度
    provincesInfo = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                               "Province.xlsx"), "province")
    # #获取国家名 地址列表
    country_name = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                              "Countries.xlsx"), "country")

    countryList = []  # 国家名list，有序
    countrySwitch = CountrySwitchName.getcountrySwitch()
    # 替换一些国家的名字
    for i in range(countryNum):
        countryName=country_name[i, 0].encode("utf-8")
        if(countrySwitch.has_key(countryName) and  countrySwitch[countryName]!=""):
            countryList.append(countrySwitch[countryName])
        else:
            countryList.append(countryName)

    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP7_DIR"])
    print files  # .xlsx结果文件列表
    resultList = []  # 全部excel文件处理后的结果，容器
    errMsg = ""  # 错误信息
    unit = '%'  # 单位 默认undefined
    for file in files:  # 遍历每个excel文件
        try:
            result = {}  # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName  # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]  # 文件全名 （不带后缀）
            print file + " start"



        except BaseException :
            print "Error: 文件有问题: " + file
            print BaseException
            errMsg += file + "<br/>"


    resultListJson = json.dumps(resultList)
    print "Map7返回值 resultListJson :"
    return resultListJson