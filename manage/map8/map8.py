#coding:utf-8
#!/usr/bin/python

#  图8
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
#   1个sheet ，sheet名字是"Unit"，第一个记录的是单位，
#   1个sheet，sheet名字是"item", 是n*2的矩阵，第一列是城市名或国家名，第二列是分类
#   其余sheet，是n*n矩阵，其中sheet名是年份，数据是n个城市对n个城市的数据
#   注意：不同的excel里面，n可能是不同的，n要从"item"里面动态获取

def getTableData():

    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP8_DIR"])
    print (files)  # .xlsx结果文件列表
    resultList = []  # 全部excel文件处理后的结果，容器

    for file in files:  # 遍历每个excel文件
        try:
            result = {}  # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName  # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]  # 文件全名 （不带后缀）
            unit = ''  # 单位 默认空
            title = ''
            print(file + " start")

            excelData = xlrd.open_workbook(file, "rb")  # excel的全部数据
            emptySheets = []  # 空数据的sheet
            timeline = []  # timeline  滚动轴 的 数据集合
            sheetNameList = excelData.sheet_names()  # 获取此文件的全部sheet名
            seriesList = {}  # series数据，
            matrixList=[]   # 所有 n*n 城市对城市的数据

            #先读取名称是"item"的sheet，获取  cityNum 、城市名以及城市分类
            #excelData.sheet_by_name("item")
            if('item' not in sheetNameList):
                # 如果不存item，那么excel错误，
                print("Error: 文件有问题: " + file)
                break
            else :      # 读取“item”
                sheetData = ExcelTool.getNpArrayFromSheet(excelData,"item","name",0,2) #只有两列
                cityNum = sheetData.shape[0]  #   城市的数目
                result['cityNum'] = cityNum  # 城市的数目
                cityList = []
                cityInfo=[]
                for row in range(cityNum):
                    cityList.append(sheetData[row][0])  # 城市列表，有序
                    cityInfo.append([
                        sheetData[row][0],
                        int(float(str(sheetData[row][1])))
                    ])
                result['cityList'] = cityList
                result['cityInfo'] = cityInfo
            # 处理 名称是"unit"的sheet，获取  单位
            if('unit' not in sheetNameList):
                print("Error: 文件有问题: " + file)
                break
            else:
                unit = excelData.sheet_by_name("unit").cell_value(0, 0)
                title = excelData.sheet_by_name("unit").cell_value(0, 1)
                result['unit'] = unit  # 单位
                result['title'] = title  # 单位

            #   遍历其他sheet
            for n in range(len(sheetNameList)):
                # 开始处理某个sheet
                sheetName = sheetNameList[n].lower() #小写
                if(sheetName == 'unit' or sheetName == 'item'):
                    continue
                # 处理（某sheet）数据
                sheetData = ExcelTool.getNpArrayFromSheet(excelData, sheetName, 'name',
                                                    row=cityNum, column= cityNum)  # 获取某年（某sheet）的数据
                matrix =getArrayFromSheet=ExcelTool.getArrayFromSheet(excelData, sheetName, 'name',
                                                    row=cityNum, column= cityNum)
                if (sheetData.shape[1] != cityNum or sheetData.shape[0] != cityNum):
                    # 跳过这个sheet
                    print(fullFileName + " 的sheet有问题: " + sheetName)
                    continue;
                # 先处理空sheet
                if (len(sheetData) == 0):
                    emptySheets.append(sheetName)  # 记下空sheet
                    continue  # 直接跳出，不显示空sheet的数据
                # 再处理非空sheet
                # 先遍历一遍，如果有负数，处理成0
                ExcelTool.setZero(matrix,cityNum,cityNum)
                timeline.append(sheetName)  # 年份加入timeline中,转为int
                matrixList.append(matrix)

            result["matrixList"] = matrixList  # 每年的matrix数据
            result["timeline"] = timeline  # 滚动轴，sheet名集合
            result["emptySheets"] = emptySheets  # 空数据sheet名集合
            resultList.append(result)
        except BaseException :
            print ("Error: 文件有问题: " + file)
            import traceback
            traceback.print_exc()

    resultListJson = json.dumps(resultList)
    print("Map8返回值 resultListJson :")
    return resultListJson
