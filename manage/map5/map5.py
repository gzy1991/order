#coding:utf-8
#!/usr/bin/python

#  图4
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
#   1个 189*n   矩阵   ，sheet名字是"Index"，记录的是原始数据
#   n个 189*189 矩阵   ，记录的是中间数据
#   1个sheet ，sheet名字是"Unit"，记录的是单位，里面有n个单位
#   注意：不同的excel里面，n可能是不同的，n要动态获取


#获得table数据 ，json格式,。所有的excel都处理成json格式数据，返回给前台、

def getTableData():
    countryNum = 189  # 全部国家总数
    #countryNum = 100  # 国家总数，100个国家
    # 获取省份名列表，包括 ： 中文名、英文名、纬度、经度
    # #获取国家名 地址列表
    country_name = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                "Countries.xlsx"), "country")
    # BR国家子集合，包含63个国家名，或其别名
    sunCountrys=SubCountrys.getBrCountryList()
    countryList = []  # 国家名list，有序
    countryInfo={}      #国家信息，带序号
    countrySwitch=CountrySwitchName.getcountrySwitch()
    # 替换一些国家的名字
    for i in range(countryNum):
        countryName=country_name[i, 0].encode("utf-8")
        if(countrySwitch.has_key(countryName) and  countrySwitch[countryName]!=""):
            countryList.append(countrySwitch[countryName])
            countryInfo[countrySwitch[countryName]] = {"EchartName":countrySwitch[countryName],"SourceName":countryName,"sort":i}
        else:
            countryList.append(countryName)
            countryInfo[countryName] = {"EchartName": countryName,"SourceName":countryName, "sort": i}

    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP5_DIR"])
    print files  # .xlsx结果文件列表
    resultList = []  # 全部excel文件处理后的结果，容器
    errMsg = ""  # 错误信息
                # 单位 默认undefined

    for file in files:      # 遍历每个excel文件
        try:
            result = {}  # 单个excel文件处理后的结果
            original = []  # 原始数据
            middleData = []  # 中间数据
            middleNameList = []  # 中间数据的sheet名，有序
            unit = []           #单位
            sheetMaxSource = []     #原始数据，每个指标的最大值,也就是每个中间数据shet的最大值
            sheetMax = []           #中间数据，每个指标的最大值,也就是每个中间数据shet的最大值
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName  # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]  # 文件全名 （不带后缀）
            print file + " start"

            excelData = xlrd.open_workbook(file, "rb")
            sheetNameList = excelData.sheet_names()  # 获取此文件的全部sheet名
            n = len(sheetNameList)-2    # n是中间数据sheet的个数，也就是雷达图中indicator指标的个数。sheets中有一个Index，一个unit，其余的都是中间数据

            for sheetName in sheetNameList:  # 遍历所有sheet
                if(sheetName == "Unit"):            # 单位sheet     1*n矩阵
                    sheetData = ExcelTool.getArrayFromSheet(excelData,sheetName,"name")
                    for i in range(n):
                        unit.append(sheetData[0][i].encode("utf-8"))
                elif (sheetName == "Index"):        #源数据sheet   189*n矩阵
                    sheetData = ExcelTool.getArrayFromSheet(excelData,sheetName,"name",countryNum,n)
                    # sheetDataSort = np.argsort(-sheetData, axis=0)  # 排序，按列排序，降序
                    # for column in range(n):  #列，先记录下每列的最大值，
                    #     sheetMaxSource.append(sheetData[sheetDataSort[0][n]][n])
                    for row in range(countryNum):
                        originalRow=[]
                        for column in range(n):
                            if sheetData[row][column].encode("utf-8")=='':#空cell处理成0
                                originalRow.append(0)
                            else:
                              originalRow.append(float(sheetData[row][column].encode("utf-8")))#转为float
                        original.append(originalRow)

                    sheetDataSort = np.argsort(-np.array(original).astype(np.float64), axis=0)  # 排序，按列排序，降序
                    for column in range(n):  # 列，先记录下每列的最大值，
                        sheetMaxSource.append(original[sheetDataSort[0][column]][column])
                else:                               #中间数据sheet   189*189矩阵
                    middleNameList.append(sheetName.encode("utf-8"))            #中间数据的sheet名，有序
                    sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, "name", countryNum, countryNum)
                    sheetMax.append(np.max(sheetData)     )      #此sheet的最大值
                    #排序
                    #sheetDataSort=np.argsort(-sheetData,axis=1)  #排序，按行排序，降序

                    #遍历整个sheet
                    middleSheet=[] #此sheet的数据容器
                    for row in range(countryNum):
                        middleRow = [] # 此sheet中，某行的数据容器
                        for column in range(countryNum):
                            middleRow.append(sheetData[row][column])
                        middleSheet.append(middleRow)
                    middleData.append(middleSheet)


            result["original"]=original  #原始数据
            result["middle"]=middleData  #中间数据
            result["middleNameList"]=middleNameList  #中间数据 sheet名称，也就是指标名称,有序
            result["sheetMax"]=sheetMax               #中间数据 sheet的最大值
            result["sheetMaxSource"]=sheetMaxSource   #原始数据sheet，每个指标的最大值
            result["unit"] = unit  # 单位
            result["countryList"] = countryList  # 国家列表  有序列表
            result["countryInfo"] = countryInfo  # 国家字典  带序号

            resultList.append(result)


        except BaseException,e:
            print "############################################ "
            print "Error: 文件有问题: " + file
            print traceback.format_exc()
            errMsg += file + "<br/>"
            print "############################################ "

    resultListJson = json.dumps(resultList)
    print "Map5返回值 resultListJson :"
    return  resultListJson






