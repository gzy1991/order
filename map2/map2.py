#coding:utf-8
#!/usr/bin/python

# 批量读取 excel_map2中的数据 ，
import os
import  sys
import xlrd
import xlwt
import numpy as np
import json
import Tool.ExcelTool as ExcelTool

# 获得table数据 json格式,
# 对每个excel的数据，进行排序，找出每个省份出口前5和进口前5
def getTableData():
    proShowNum = 5  # 每个省份的前5个进口货出口。默认是5，这个参数可以从页面上传进来
    provinceNum=31  #省份数量，默认是31
    provincesInfo = ExcelTool.getArrayBySheetName("\\country_excel\\Province.xlsx","province")  #获取省份名列表，包括 ： 中文名、英文名、纬度、经度
    print(os.getcwd())
    #files = get_file_name_list()
    files = ExcelTool.listExcelFile("\\excel_map2")
    print files  # .xlsx结果文件列表
    resultList = []
    errMsg = "";

    for file in files:      # 遍历每个excel文件
        try :
            result = {}  # 单个excel文件处理后的结果
            file_name = file.split("\\")[len(file.split("\\")) - 1].split(".")[0]
            result['importProvinceNum']=proShowNum
            result['exportProvinceNum']=proShowNum
            result["fileName"] = file_name
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
                proInfo = provincesInfo[i]

                provinceResult=[]
                exportData=

                proInfo["exportData"]
                proInfo["importData"]

                result[]=





            resultList.append(result)
            #一个文件计算完毕
        except BaseException:
            print "Error: 文件有问题," + file
            errMsg += file + "<br/>"

    resultListJson=json.dumps(resultList)
    print "返回值 resultListJson :"
    print   resultListJson
    return  resultListJson





