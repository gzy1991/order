#coding:utf-8
#!/usr/bin/python

#  图4
#  获得table数据， json格式,
#

import os
import xlrd
import numpy as np
import json
import Tool.ExcelTool as ExcelTool
import order.settings as Setting
import Tool.country as CountrySwitchName
import Tool.BrRegion  as SubCountrys

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
    # BR国家子集合，包含63个国家名，或其别名
    sunCountrys=SubCountrys.getBrCountryList()
    countryList = []  # 国家名list，有序
    countrySwitch=CountrySwitchName.getcountrySwitch()
    # 替换一些国家的名字
    for i in range(countryNum):
        countryName=country_name[i, 0]
        # if(countrySwitch.has_key(countryName) and  countrySwitch[countryName]!=""):
        if( countryName in countrySwitch and  countrySwitch[countryName]!=""):
            countryList.append(countrySwitch[countryName])
        else:
            countryList.append(countryName)
    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP4_DIR"])
    print(files)   # .xlsx结果文件列表
    resultList = []  # 全部excel文件处理后的结果，容器
    errMsg = ""  # 错误信息
    unit='%'            # 单位 默认undefined

    for file in files:      # 遍历每个excel文件
        try:
            result = {}  # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result["fullFileName"] = fullFileName  # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]  # 文件全名 （不带后缀）
            print( file + " start")

            excelData = xlrd.open_workbook(file, "rb")
            emptySheets = []  # 空数据的sheet

            timeline = []  # timeline  滚动轴 的 数据集合
            sheetNameList = excelData.sheet_names()  # 获取此文件的全部sheet名
            seriesList = {}  # series数据，，所有省份对国家的数据,
            #初始化seriesList,每个省份数据都会空的list
            for i in range(provinceNum):
                seriesList[provincesInfo[i][2]]=[]

            validData = []     # sheet中 所有有效数据之和，
            validDataNum=0           #有效数据的个数，大于0的数据都是有效数据
            maxMin=[]               #全部sheet，每个sheet的最大值和最小值
            for sheetName in sheetNameList:  # 遍历所有sheet
                #处理某个sheet
                sheetMaxMin = []  # 记录下每个sheet，每列的最大值，最小值
                #sheetName = sheetName  # sheet名转码
                 #处理（某sheet）的数据
                timeline.append(sheetName)  # 年份加入timeline中,转为int
                sheetData = ExcelTool.getNpArrayFromSheet(excelData, sheetName, 'name',
                                                        row=countryNum,column=provinceNum)  # 获取某年（某sheet）的数据
                #sheetData.sum()/(countryNum*provinceNum)
                # 先处理空sheet
                if (len(sheetData) == 0):
                    maxMin.append([0,0])  #给这个sheet设置个默认的最大最小值
                    #创建一个189*31的 零矩阵
                    for i in range( provinceNum):                   #遍历省份，即每一列
                        seriesCountry = []                         #某列的数据，即某省在某年的数据
                        # seriesCountrySub=[]                         # 某列的数据，即某省在某年的数据,只包含指定的63个国家
                        for k in range(countryNum):                 #遍历此列的所有国家
                            countryInfo = []
                            countryInfo.append(189)  # 排序
                            countryInfo.append(0)  # 数据
                            countryInfo.append(countryList[k])  # 国家名
                            seriesCountry.append({
                                "name": countryList[k],
                                "value": countryInfo
                            })
                            # if (countryList[k] in sunCountrys ):
                            #     seriesCountrySub.append({
                            #         "name": countryList[k],
                            #         "value": countryInfo
                            # })
                        seriesList[provincesInfo[i][2]].append({
                            "time": sheetName,
                            "min": -1,#注意，这里设置的min和max，刚好可以使空sheet，在地图上展示的时候，不渲染任何颜色，min和max不能包括数据0
                            "max": -0.1,
                            "data": seriesCountry,
                            "subData": []
                        })
                    emptySheets.append(sheetName)   #记下空sheet
                    continue

                #再处理非空sheet
                # 先遍历一遍，如果有负数，处理成0
                for row in range(countryNum):
                    for column in range(provinceNum):  #
                        if (sheetData[row][column] < -100 or sheetData[row][column] > 100):  #大于100或者小于-100，处理成0
                            sheetData[row][column] = 0
                sheetDataSort = np.argsort(-sheetData, axis=0)  # 排序，按列排序，降序


                for i in range(provinceNum): #遍历省份，即每一列
                    sheetMaxMin.append(sheetData[sheetDataSort[0][i]][i])
                    sheetMaxMin.append(sheetData[sheetDataSort[countryNum-1][i]][i])
                    #处理某一列的数据
                    sort={}
                    for j in range(countryNum):
                        sort[sheetDataSort[j][i]]=j+1     # 索引从0开始，排序从1开始。获取到此列（某省）的买个国家的排序
                    seriesCountry = []                    # 某列的数据，即某省在某年的数据
                    seriesCountrySub = []                    # 某列的数据，即某省在某年的数据,只包含指定的63个国家
                    for k in range(countryNum):  #遍历此列的所有国家
                        countryInfo = []
                        countryInfo.append(sort[k])  # 排序
                        countryInfo.append(sheetData[k][i])  # 数据
                        #countryInfo.append(sheetName)  # sheet名，滚动轴项名
                        countryInfo.append(countryList[k])  # 国家名
                        seriesCountry.append({
                            "name":countryList[k],
                            "value":countryInfo
                        })
                        if(countryList[k] in sunCountrys and countryList[k]!="China"):
                            seriesCountrySub.append({
                                "name": countryList[k],
                                "value": countryInfo
                        })
                        if(sheetData[k][i]>0):              #记录下有效数据
                            validData.append(sheetData[k][i])
                            validDataNum=validDataNum+1

                    seriesList[provincesInfo[i][2]].append({
                        "time":sheetName,
                        "min":sheetData[sheetDataSort[countryNum-1][i]][i],
                        "max":sheetData[sheetDataSort[0][i]][i],
                        "data":seriesCountry,
                        "subData":seriesCountrySub
                    })
                maxMin.append([min(sheetMaxMin),max(sheetMaxMin)])
            result["average"]=np.array(validData).sum()/validDataNum   #平均值
            result["counties"] = countryList        # 国家列表
            result["timeline"] = timeline           # 滚动轴，sheet名集合
            result["emptySheets"] = emptySheets    # 空数据sheet名集合
            result["series"] = seriesList
            result['unit'] = unit                   # 单位
            result['maxMin'] = maxMin                   # 每个sheet的最大最小值

            resultList.append(result)
            print(file + " end")
        except BaseException:
            print ("Error: 文件有问题: " + file)
            import traceback
            traceback.print_exc()
            errMsg += file + "<br/>"

    resultListJson = json.dumps(resultList)
    print ("Map4返回值 resultListJson :")
    #print( resultListJson)
    return  resultListJson






