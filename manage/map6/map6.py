#coding:utf-8
#!/usr/bin/python

#  图6
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


#获得table数据 ，json格式,。所有的excel都处理成json格式数据，返回给前台
def getTableData():
    countryNum = 189            # 全部国家总数  189个国家
    lineNum=3                   # 每个层级里，线的数目
    # #获取国家名 地址列表
    country_name = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                              "Countries.xlsx"), "country")
    # BR国家子集合，包含63个国家名，或其别名
    sunCountrys = SubCountrys.getBrCountryList()
    countryList = []  # 国家名list，有序
    countryInfo = {}  # 国家信息，带序号
    countrySwitch = CountrySwitchName.getcountrySwitch()
    # 替换一些国家的名字, echarts中，有些国家的名字与excel中的国家名对不上
    for i in range(countryNum):
        countryName=country_name[i, 0]
        flag= False;                        #是否是BR国家，默认不是
        if (countryName in sunCountrys or
                # (countrySwitch.has_key(countryName)  and  countrySwitch[countryName] in sunCountrys)):
                (countryName in  countrySwitch and  countrySwitch[countryName] in sunCountrys)):
            flag = True
        # if(countrySwitch.has_key(countryName) and  countrySwitch[countryName]!=""):
        if(countryName in countrySwitch and  countrySwitch[countryName]!=""):
            countryList.append(countrySwitch[countryName])
            countryInfo[countrySwitch[countryName]] = {"EchartName":countrySwitch[countryName],"SourceName":countryName,"sort":i,"isBrRegion":flag}
        else:
            countryList.append(countryName)     #其中countryName是EchartName
            countryInfo[countryName] = {"EchartName": countryName,"SourceName":countryName, "sort": i,"isBrRegion":flag}#其中countryName是EchartName

    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP6_DIR"])
    print (files )                      # .xlsx结果文件列表
    resultList = []                          # 全部excel文件处理后的结果，容器
    errMsg = ""                              # 错误信息
    # 单位 默认undefined

    for file in files:
        try:
            result = {}                 # 单个excel文件处理后的结果
            original = []               # 原始数据
            middleData = []             # 中间数据
            middleDataSort = []         # 中间数据   的  排序数据
            DataNameList = []           # 中间数据的sheet名，有序
            unit = []                   # 单位
            sheetMaxSource = []         # 原始数据，每个指标的最大值,也就是每个中间数据shet的最大值
            sheetMax = []               # 中间数据，每个指标的最大值,也就是每个中间数据shet的最大值
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName                       # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]                 # 文件全名 （不带后缀）
            print (file + " start")

            excelData = xlrd.open_workbook(file, "rb")
            sheetNameList = excelData.sheet_names()                    # 获取此文件的全部sheet名
            n = len(sheetNameList)-1                                   # n是中间数据sheet的个数，一个unit，其余的都是中间数据

            for sheetName in sheetNameList:                                 # 遍历所有sheet
                if (sheetName == "Unit"):                                   # 单位sheet    1*n矩阵
                    sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, "name",1,1)
                    unit=sheetData[0][0]
                else:                                                       #中间数据sheet   189*189矩阵
                    DataNameList.append(sheetName)        # 中间数据的sheet名，有序
                    sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, "name", countryNum, countryNum)
                    # 遍历整个sheet
                    middleSheet = []  # 此sheet的数据容器
                    for row in range(countryNum):
                        middleRow = []  # 此sheet中，某行的数据容器
                        for column in range(countryNum):
                            middleRow.append(sheetData[row][column])
                        middleSheet.append(middleRow)
                    middleData.append(middleSheet)

                    # 遍历整个sheetDataSort
                    sheetDataSort = np.argsort(-sheetData, axis=1)  # 排序，按行排序，降序
                    middleSheetSort = []  # 此sheetSort的数据容器
                    for row in range(countryNum):
                        middleRowSort = []  # 此sheet中，某行的数据容器
                        for column in range(countryNum):
                            middleRowSort.append(int(sheetDataSort[row][column]))       #这里要吧int64转换成int，不然下面的json.dumps会报错
                        middleSheetSort.append(middleRowSort)
                    middleDataSort.append(middleSheetSort)


            result["middleData"]=middleData                      #数据
            result["middleDataSort"]=middleDataSort         #数据的排序
            result["level"]=n                                 #层级, 等于sheet的个数-1
            # result["curLevel"]=0                             #当前所在层级,默认是0，这个属性，主要用在前台的逻辑控制
            result["DataNameList"] = DataNameList            # 数据 sheet名称，也就是指标名称,有序
            result["countryList"] = countryList  # 国家列表  有序列表
            result["countryInfo"] = countryInfo  # 国家字典  带序号
            result["unit"] = unit  # 国家字典  带序号

            resultList.append(result)
            print(file + " end")
        except BaseException as e:
            print ("############################################ ")
            print ("Error: 文件有问题: " + file)
            import traceback
            traceback.print_exc()
            errMsg += file + "<br/>"
            print ("############################################ ")

    resultListJson = json.dumps(resultList)
    print ("Map6返回值 resultListJson :")
    return resultListJson
