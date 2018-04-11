#coding:utf-8
#!/usr/bin/python

#  图3
#  获得table数据， json格式,
#  对每个excel的数据，获取每年，每个国家的人均gdp和人均消耗量

import os
import  sys
import xlrd
import xlwt
import numpy as np
import json
import Tool.ExcelTool as ExcelTool
import order.settings as Setting

#获得table数据 ，json格式,
def getTableData():

    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP3_DIR"])
    print files             # .xlsx结果文件列表
    resultList = []
    errMsg = ""             #错误信息
    countryNum=189          #国家总数

    for file in files:      # 遍历每个excel文件
        try:
            result = {}     # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName               # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]     # 文件全名 （不带后缀）
            print file + " start"

            excelData = xlrd.open_workbook(file, "rb")
            unit = ''  # 单位
            unitX = ''  # 单位
            unitY = ''  # 单位
            xAxis = []      #x轴最小值  最大值 人均gdp
            yAxis = []      #y轴最小值  最大值 人均消耗
            symbolSize=[]   # sheet中 气泡大小之和列表，
            # 获取国家名列表
            country_name = ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"], "Countries.xlsx"),"country")
            countryList=[]   #  国家名list，有序
            for i in range(countryNum):
                countryList.append(country_name[i,0].encode("utf-8"))

            timeline=[]                                         #timeline  ,年数的集合
            sheetNameList=excelData.sheet_names()               #获取此文件的全部sheet名
            seriesList=[]                                       # series数据，所有年份，所有国家的数据
            for sheetName in sheetNameList:                     #遍历sheet
                sheetName=sheetName.encode("utf-8")             #转码
                if sheetName != 'Unit':                         #处理某年（某sheet）的数据
                    sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, 'name')   #获取某年（某sheet）的数据
                    symbolSize.append(sheetData[:,2].sum())       #本sheet中，气泡大小之和
                    series=[]                                     # 某年，所有国家的数据
                    timeline.append(int(sheetName))               # 年份加入timeline中,转为int
                    sheetDataSort=np.argsort(-sheetData ,axis=0 )                          #排序，按列排序，降序
                    xAxis.append([sheetData[sheetDataSort[0][0]][0]  , sheetData[sheetDataSort[countryNum-1][0]][0] ])      #把最大值和最小值都先存起来，之后比较
                    yAxis.append([sheetData[sheetDataSort[0][1]][1]  , sheetData[sheetDataSort[countryNum-1][1]][1] ])      #把最大值和最小值都先存起来，之后比较
                    sort={}                                                                #气泡大小排序 ，
                    for i in range(countryNum):
                        sort[sheetDataSort[i][2]]=i                   # 索引和排序都从0开始
                    for j in range(countryNum):
                        seriesCountry=[]                                #某年某个国家的数据
                        seriesCountry.append(sheetData[j][0])           # 人均gdp
                        seriesCountry.append(sheetData[j][1])           # 人均消耗量
                        seriesCountry.append(countryList[j])            # 国家名
                        seriesCountry.append(sort[j]+1)                   # 排序号，气泡大小的排序号. 从1开始
                        seriesCountry.append(sheetData[j][2])           # 气泡大小
                        series.append(seriesCountry)
                    seriesList.append(series)
                else:                                       #处理3个单位
                    unit = excelData.sheet_by_name("Unit").cell_value(0, 1)     # 标题单位
                    unitX = excelData.sheet_by_name("Unit").cell_value(1, 1)    # X轴单位
                    unitY= excelData.sheet_by_name("Unit").cell_value(2, 1)     # Y轴单位

            # 从excel获取sheet， 转化成numpy.array
            result['unit'] = unit.encode("utf-8")                           # 单位
            result['unitX'] = unitX.encode("utf-8")                         # 单位X轴
            result['unitY'] = unitY.encode("utf-8")                         # 单位Y轴
            result["xAxisMax"] = np.array(xAxis).max()      #x轴最小值  最大值 人均gdp
            result["xAxisMin"] = np.array(xAxis).min()      #x轴最小值  最大值 人均gdp
            result["yAxisMax"] = np.array(yAxis).max()      #y轴最小值  最大值 人均消耗
            result["yAxisMin"] = np.array(yAxis).min()      #y轴最小值  最大值 人均消耗
            result["counties"]=countryList
            result["timeline"]=timeline
            result["series"]=seriesList
            result["averageSize"]=np.array(symbolSize).sum()/ (countryNum *len(timeline))                # 气泡大小平均值

            resultList.append(result)
        except BaseException:
            print "Error: 文件有问题: " + file
            print BaseException
            errMsg += file + "<br/>"

    resultListJson = json.dumps(resultList)
    print "Map3返回值 resultListJson :"
    print   resultListJson
    return resultListJson








