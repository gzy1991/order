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
#   n个 189*62 矩阵   ，其中的数据，前31列是31省的进口数据，后31列是31省的出口数据
#   1个sheet ，sheet名字是"Unit"，第一个记录的是单位， ,第二个是标题
#   注意：不同的excel里面，n可能是不同的，n要动态获取

def getTableData():
    countryNum = 189    # 全部国家总数  189个国家
    provinceNum = 31    # 中国的31个省市自治区，不处理港澳台
    countryShowNum =10  #对于每个省份，只要展示其进口前10名和出口前10名
    # 获取省份名列表，包括 ： 中文名、英文名、纬度、经度
    provincesInfo = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                               "Province.xlsx"), "province")
    proInfoList = {} #省份的经纬度信息
    for iii in range(provinceNum):
        proName = provincesInfo[iii, 2].encode("utf-8")   # 省份名字
        proLatitude = provincesInfo[iii, 4].encode("utf-8")   # 省份纬度
        proLongitude=provincesInfo[iii, 5].encode("utf-8")   # 省份经度
        proInfoList[proName]={
            "name":proName,
            "latitude":proLatitude,
            "longitude":proLongitude
        }

    # #获取国家名 地址列表
    country_name = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],
                                                              "Countries.xlsx"), "country")
    # BR国家子集合，包含63个国家名，或其别名
    sunCountrys = SubCountrys.getBrCountryList()
    countryList = []  # 国家名list，有序
    countrySwitch = CountrySwitchName.getcountrySwitch()
    # 替换一些国家的名字
    for ii in range(countryNum):
        countryName=country_name[ii, 0].encode("utf-8")
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

            excelData = xlrd.open_workbook(file, "rb") #excel的全部数据
            emptySheets = []  # 空数据的sheet

            timeline = []  # timeline  滚动轴 的 数据集合
            sheetNameList = excelData.sheet_names()  # 获取此文件的全部sheet名
            seriesList = {}  # series数据，，所有省份对国家的数据,
            #初始化seriesList,每个省份数据都会空的list
            for m in range(provinceNum):
                seriesList[provincesInfo[m][2]]=[]

            # 遍历所有sheet
            for n in range(len(sheetNameList)):
                #开始处理某个sheet
                sheetName = sheetNameList[n]
                sheetName = sheetName.encode("utf-8")  # sheet名转码

                #处理单位
                if sheetName == 'Unit':
                    unit = excelData.sheet_by_name("Unit").cell_value(0, 0)
                    title = excelData.sheet_by_name("Unit").cell_value(0, 1)
                    continue

                # 处理（某sheet）数据
                timeline.append(int(sheetName)) #年份加入timeline中,转为int
                sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, 'name',
                                                        row=countryNum,column=2*provinceNum)  # 获取某年（某sheet）的数据
                if(sheetData.shape[1]!=62 or sheetData.shape[0]!=189):
                    #跳过这个sheet
                    print(fullFileName+" 的sheet有问题: "+sheetName)
                    continue;
                #先处理空sheet
                if(len(sheetData)==0):
                    emptySheets.append(sheetName)  # 记下空sheet
                    continue  #直接跳出，不显示空sheet的数据

                #再处理非空sheet
                #先遍历一遍，如果有负数，处理成0
                for row in range(countryNum):
                    for column in range(provinceNum*2):  #
                        if (sheetData[row][column] < 0 ):  #小于0，处理成0
                            sheetData[row][column] = 0

                # 排序，按列排序，降序
                sheetDataSort = np.argsort(-sheetData, axis=0)
                # 遍历省份，即每一列  ,前31列是进口数据，后31列是出口数据
                for i in range(provinceNum*2):
                    # 处理某一列的数据
                    seriesCountry = []                    # 某列的数据，即某省在某年的数据
                    for k in range(countryShowNum) :#遍历前31列中，每列的排序前10的国家，进口
                        kCoun=sheetDataSort[k][i]     #此列排第k个国家的国家序号
                        #sheetData[kCoun][i] # 值
                        isBr = 0  #是否是BR国家,默认不是
                        if (countryList[kCoun] in sunCountrys and countryList[k] != "China"):
                            isBr = 1
                        seriesCountry.append({
                            "name": countryList[kCoun],  #国家名
                            "value":sheetData[kCoun][i], #值
                            "isBr":isBr #是否是BR国家
                        })
                    #对于每个省份的seriesList，前10个是进口数据，后10个是出口数据
                    if i<provinceNum:
                        seriesList[provincesInfo[i][2]].append({
                            "data": seriesCountry
                        })
                    else :
                        for seriesCountryInfo in seriesCountry:        #把10个出口数据，放到进口数据后面
                            seriesList[provincesInfo[i - provinceNum][2]][n]["data"].append(seriesCountryInfo)
            result["counties"] = countryList  # 国家列表
            result["timeline"] = timeline           # 滚动轴，sheet名集合
            result["emptySheets"] = emptySheets    # 空数据sheet名集合
            result["series"] = seriesList
            result['unit'] = unit  # 单位
            result['title'] = title # 标题
            result['proInfoList'] = proInfoList  # 省份的经纬度信息
            resultList.append(result)
        except BaseException :
            print "Error: 文件有问题: " + file
            print BaseException
            errMsg += file + "<br/>"

    resultListJson = json.dumps(resultList)
    print "Map7返回值 resultListJson :"
    return resultListJson