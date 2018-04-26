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

#   关于本图中excel的格式规则
#   sheet名为“Unit” 或年份 如 1991、1992
#   其中年份sheet的格式：   189行*3列
#   第1列 人均gdp   Y轴
#   第2列 人均消耗  X轴
#   第3列   气泡大小
#   其中Unit 的sheet的格式： 3*3
#   第一行第二列         标题单位
#   第二行第二列         Y轴单位
#   第三行第二列         X轴单位


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
            unit = 'undefined'  # 单位 默认undefined
            unitX = 'undefined'  # 单位
            unitY = 'undefined'  # 单位
            emptySheets=[]           # 空数据的sheet
            xAxis = []      # x轴最小值  最大值    人均消耗
            yAxis = []      # y轴最小值  最大值    人均gdp
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
                    timeline.append(int(sheetName))  # 年份加入timeline中,转为int
                    series = []  # 某年，所有国家的数据
                    sheetData = ExcelTool.getArrayFromSheet(excelData, sheetName, 'name',row=countryNum)   #获取某年（某sheet）的数据
                    #先处理空sheet
                    if (len(sheetData)==0):
                        seriesList.append(series)
                        emptySheets.append(sheetName)
                        continue
                    # 遍历一遍，如果有负数，处理成0
                    for row in range(countryNum):
                        for column in range(3):                 #   默认都是3列
                            if(sheetData[row][column]<0):
                                sheetData[row][column]=0
                    symbolSize.append(sheetData[:,2].sum())              #本sheet中，气泡大小之和
                    sheetDataSort=np.argsort(-sheetData ,axis=0 )        #排序，按列排序，降序
                    yAxis.append(sheetData[sheetDataSort[0][1]][1])      #把最大值 先存起来，之后比较
                    for index in range(1,countryNum):                   #找到y轴最小的非0值，作为y轴最小值
                        if (sheetData[sheetDataSort[countryNum-index][1]][1]  !=0):
                            yAxis.append(sheetData[sheetDataSort[countryNum-index][1]][1])
                            break
                    xAxis.append([sheetData[sheetDataSort[0][0]][0]  , sheetData[sheetDataSort[countryNum-1][0]][0] ])      #把最大值和最小值都先存起来，之后比较
                    sort={}                                                                #气泡大小排序
                    for i in range(countryNum):
                        sort[sheetDataSort[i][2]]=i                   # 索引和排序都从0开始
                    for j in range(countryNum):
                        seriesCountry=[]                                #某年某个国家的数据
                        seriesCountry.append(sheetData[j][0])           # 人均消耗量
                        seriesCountry.append(sheetData[j][1])           # 人均gdp
                        seriesCountry.append(countryList[j])            # 国家名
                        seriesCountry.append(sort[j]+1)                   # 排序号，气泡
                        # 大小的排序号. 从1开始
                        seriesCountry.append(sheetData[j][2])           # 气泡大小
                        series.append(seriesCountry)
                    seriesList.append(series)
                else:                                       #处理3个单位
                    unit = excelData.sheet_by_name("Unit").cell_value(0, 2)     # 标题单位
                    unitY = excelData.sheet_by_name("Unit").cell_value(0, 1)    # Y轴单位
                    unitX= excelData.sheet_by_name("Unit").cell_value(0, 0)     # X轴单位

            xMax=handleMaxMin(xAxis,"max")
            xMin=handleMaxMin(xAxis,"min")
            yMax=handleMaxMin(yAxis,"max")
            yMin=handleMaxMin(yAxis,"min")

            result['unit'] = unit.encode("utf-8")                           # 单位
            result['unitX'] = unitX.encode("utf-8")                         # 单位X轴
            result['unitY'] = unitY.encode("utf-8")                         # 单位Y轴
            result["xAxisMax"] = np.array(yAxis).max()      #x轴最小值  最大值 人均消耗
            result["xMax"] = xMax                           #x轴最大值 人均消耗
            result["xMin"] = xMin                           #x轴最小值 人均消耗
            result["xAxisMin"] = np.array(xAxis).min()      #x轴最小值  最大值 人均消耗
            result["yAxisMax"] = np.array(yAxis).max()      #y轴最小值  最大值 人均gdp
            result["yAxisMin"] = np.array(yAxis).min()      #y轴最小值  最大值 人均gdp
            result["yMax"] = yMax                           # y轴最大值   人均gdp
            result["yMin"] = yMin                           # y轴最小值   人均gdp
            result["counties"]=countryList                  #国家列表
            result["timeline"]=timeline                     #时间 ，sheet名集合
            result["emptySheets"]=emptySheets              #空数据sheet名集合
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


#对x或y轴的最大值或最小值做下处理：乘以0.9后，找最近的整数
#type :max 或者 min
def handleMaxMin(list,type):
    if(type=="max"):
        newData=np.array(list).max()*0.9
    elif(type=="min"):
        newData = np.array(list).min() * 0.9
    if(newData<0 or newData==0):
        return newData
    length = len(str(int(newData))) - 2
    xMaxMin = int(newData / (10 ** length)) * (10 ** length)
    return xMaxMin


