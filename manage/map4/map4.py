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
#   sheet的名字作为timeline的内容来滚动
#   每个sheet里，都是189*31的矩阵，是31个省份对189个国家的影响


#获得table数据 ，json格式,
def getTableData():
    countryNum = 189  # 国家总数
    provinceNum = 31  # 身份数量
    # 获取省份名列表，包括 ： 中文名、英文名、纬度、经度
    provincesInfo = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                   "Province.xlsx"),  "province")
    # #获取国家名 地址列表
    country_name = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                "Countries.xlsx"), "country")
    countryList = []  # 国家名list，有序
    for i in range(countryNum):
        countryList.append(country_name[i, 0].encode("utf-8"))
    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP4_DIR"])
    print files  # .xlsx结果文件列表
    resultList = []  # 全部excel文件处理后的结果，容器
    errMsg = ""  # 错误信息

    unit='%'            # 单位 默认undefined

    for file in files:      # 遍历每个excel文件
        try:
            result = {}  # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName  # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]  # 文件全名 （不带后缀）
            print file + " start"

            excelData = xlrd.open_workbook(file, "rb")
            emptySheets = []  # 空数据的sheet

            timeline = []  # timeline  滚动轴 的 数据集合
            sheetNameList = excelData.sheet_names()  # 获取此文件的全部sheet名
            seriesList = []  # series数据，，所有省份对国家的数据

            for sheetName in sheetNameList:  # 遍历所有sheet
                sheetName = sheetName.encode("utf-8")  # sheet名转码
                 #处理（某sheet）的数据
                timeline.append(int(sheetName))  # 年份加入timeline中,转为int
                series = []  # 某sheet，所有省份的数据
                sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, 'name',
                                                        row=countryNum,column=provinceNum)  # 获取某年（某sheet）的数据
                # 先处理空sheet
                if (len(sheetData) == 0):
                    #创建一个189*31的 零矩阵
                    for i in range( provinceNum):
                        tempList=[]
                        for j in range(countryNum):
                            tempList.append(0)
                        series.append(tempList)
                    seriesList.append(series)
                    emptySheets.append(sheetName)
                    continue


                #seriesProvince = []
                for i in range(provinceNum): #省份
                    seriesCountry = []
                    for j in range(countryNum):  #国家
                        seriesCountry.append(sheetData[j][i])
                    series.append(seriesCountry)
                seriesList.append(series)

            result["counties"] = countryList        # 国家列表
            result["timeline"] = timeline           # 滚动轴，sheet名集合
            result["emptySheets"] = emptySheets    # 空数据sheet名集合
            result["series"] = seriesList
            result['unit'] = unit                   # 单位

            resultList.append(result)
        except BaseException:
            print "Error: 文件有问题: " + file
            print BaseException
            errMsg += file + "<br/>"

    resultListJson = json.dumps(resultList)
    print "Map4返回值 resultListJson :"
    print   resultListJson
    return  resultListJson






