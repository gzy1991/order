#coding:utf-8
#!/usr/bin/python

# 批量读取 \\file\\map2 中的数据 ，
import os
import  sys
import xlrd
import xlwt
import numpy as np
import json
import Tool.ExcelTool as ExcelTool
import order.settings as Setting

# 获得table数据 json格式,
# 对每个excel的数据，进行排序，找出每个省份出口前5和进口前5
def getTableData():
    proShowNum = 3  # 每个省份的前5个进口货出口。默认是5，这个参数可以从页面上传进来
    provinceNum=31  #省份数量，默认是31
    print(os.path.join(Setting.FILR_DIR["COMMON_DIR"]))
    provincesInfo =ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],"Province.xlsx"),"province")#获取省份名列表，包括 ： 中文名、英文名、纬度、经度
    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP2_DIR"])
    print files  # .xlsx结果文件列表
    resultList = []
    errMsg = "";

    for file in files:      # 遍历每个excel文件
        try :
            result = {}  # 单个excel文件处理后的结果
            fullFileName = file.split("\\")[len(file.split("\\")) - 1]
            result['importProvinceNum']=proShowNum
            result['exportProvinceNum']=proShowNum
            result["fullFileName"] = fullFileName   # 文件全名 （带后缀）
            result["fileName"] = fullFileName.split(".")[0]   # 文件全名 （不带后缀）
            print file + " start"
            excelData = xlrd.open_workbook(file, "rb")

            # 从excel获取sheet， 转化成numpy.array
            Tra = ExcelTool.getArrayFromSheet(excelData, u'Tra','name')
            Tot = ExcelTool.getArrayFromSheet(excelData, u'Tot','name')

            unit = ''  # 单位
            try:
                unit = excelData.sheet_by_name("Unit").cell_value(0, 0)
            except Exception, e:
                if (e.message.find("No sheet named") == -1):
                    unit = '未定义'  # 单位未定义
            result['unit'] = unit  # 单位
            for i in range(0, len(Tot[0]) - 1):  # 对Tot做处理，把对角线数据设为0
                Tot[i, i] = 0
                Tot[i, len(Tot[0]) - 1] = 0
                Tot[len(Tot[0]) - 1, i] = 0

            Tot_importSort = np.argsort(-Tot,axis=0)  #按列排序, 进口排序，降序
            Tot_exportSort = np.argsort(-Tot,axis=1)  #按行排序，出口排序，降序
            #对31个省份循环处理
            for i in range(provinceNum):
                provinceResult={}            #该省份数据容器
                provinceResult["chineseName"]=provincesInfo[i][1]        #该省中文名 全称
                provinceResult["name"]=provincesInfo[i][2]               #该省英文名
                provinceResult["chineseAbbrName"]=provincesInfo[i][3]    #该省中文名 缩写
                provinceResult["latitude"]=provincesInfo[i][4]     #该省纬度
                provinceResult["longitude"]=provincesInfo[i][5]    #该省经度
                provinceResult["exportSum"] = Tra[i][0]  # 该省出口总值  单位PJ
                provinceResult["importSum"] = Tra[i][1]  # 该省进口总值  单位PJ
                exportData=      getProExportData(Tra,Tot,Tot_exportSort,provincesInfo,i,proShowNum)   #获取该省出口数据
                importData=      getProImportData(Tra,Tot,Tot_importSort,provincesInfo,i,proShowNum)   #获取该省进口数据
                provinceResult["exportData"]=exportData
                provinceResult["importData"]=importData

                result[provincesInfo[i][2]]=provinceResult  #该省信息
            resultList.append(result)
            #一个文件计算完毕
        except BaseException:
            print "Error: 文件有问题," + file
            print BaseException
            errMsg += file + "<br/>"

    resultListJson=json.dumps(resultList)
    print "返回值 resultListJson :"
    print   resultListJson
    return  resultListJson

#获取该省出口数据
#   Tot             所有省份的全部贸易数据
#   Tot_exportSort  所有省份的出口数据排序
#   provincesInfo   所有省份的信息
#   i               省份索引
#   proShowNum      显示的贸易对象个数
def getProExportData(Tra,Tot,Tot_exportSort,provincesInfo,i,proShowNum):
    curProExport = []               #该省出口数据 ，容器
    
    for j  in range(proShowNum):    #遍历排名前proShowNum个省份的数据
        curProExpToJPro={}          #容器
        proIndex = Tot_exportSort[i][j]     #排名第j的省份的索引
        
        curProExpToJPro["name"]  = provincesInfo[proIndex][2] #英文名
        curProExpToJPro["chineseAbbrName"]  = provincesInfo[proIndex][3] # j省中文名 缩写
        curProExpToJPro["latitude"]=provincesInfo[proIndex][4]     # j省纬度
        curProExpToJPro["longitude"]=provincesInfo[proIndex][5]    # j省经度
        curProExpToJPro["sort"]  = j+1                   #排序
        curProExpToJPro["value"] = Tot[i][proIndex]           # i省对j省的出口贸易额
        curProExpToJPro["sum"] = Tra[proIndex][1]      # j省进口总额

        curProExport.append(curProExpToJPro)

    return curProExport


#获取该省进口数据
#   Tot             所有省份的全部贸易数据
#   Tot_importSort  所有省份的进口数据排序
#   provincesInfo   所有省份的信息
#   i               省份索引
#   proShowNum      显示的贸易对象个数
def getProImportData(Tra,Tot,Tot_importSort,provincesInfo,i,proShowNum):
    curProImport = []               #该省进口数据 ，容器
    
    for j in range(proShowNum):     #遍历排名前proShowNum个省份的数据
        curProImpToJPro={}          #容器
        proIndex = Tot_importSort[j][i]     #排名第j的省份的索引

        curProImpToJPro["name"]  = provincesInfo[proIndex][2] #英文名
        curProImpToJPro["chineseAbbrName"]  = provincesInfo[proIndex][3] # j省中文名 缩写
        curProImpToJPro["latitude"]=provincesInfo[proIndex][4]     # j省纬度
        curProImpToJPro["longitude"]=provincesInfo[proIndex][5]    # j省经度
        curProImpToJPro["sort"]  = j+1                   #排序
        curProImpToJPro["value"] = Tot[proIndex][i]           # i省对j省的进口贸易额
        curProImpToJPro["sum"] = Tra[proIndex][0]      # j省出口总额

        curProImport.append(curProImpToJPro)
    return curProImport

