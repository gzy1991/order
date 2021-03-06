#coding:utf-8
#!/usr/bin/python

# 批量读取结果文件，排序，
import os
import  sys
import xlrd
import xlwt
import numpy as np
import json
import Tool.ExcelTool as ExcelTool
import order.settings as Setting



#排序
def rank_result():

    country_num = 5  # 前10个国家,这个参数可以从页面上传进来

    # #获取国家名 地址列表
    country_name =ExcelTool.getArrayBySheetName(os.path.join(Setting.FILR_DIR["COMMON_DIR"],"Countries.xlsx"),"country")
    print(os.getcwd())
    #获取结果excel 地址列表  ，只获取xls和xlsx文件
    files = ExcelTool.listExcelFile(Setting.FILR_DIR["MAP1_DIR"])
    print (files)  # .xlsx结果文件列表
    result_list=[]
    errMsg="";

    for file in files:  #批量读取

        try:
            result={}  #单个excel文件处理后的结果
            file_name = file.split("\\")[len(file.split("\\")) - 1].split(".")[0]
            result['importCountryNum'] = country_num
            result['exportCountryNum'] = country_num
            result["fileName"]=file_name
            print (file+" start")
            excelData = xlrd.open_workbook(file,"rb")

            #从excel获取sheet， 转化成numpy.array
            Tot = ExcelTool.getNpArrayFromSheet(excelData, u'Tot','name')
            FD_ = ExcelTool.getNpArrayFromSheet(excelData, u'FD_S','name')
            Tra = ExcelTool.getNpArrayFromSheet(excelData, u'Tra','name')
            FD4 = ExcelTool.getNpArrayFromSheet(excelData, u'FD4','name')
            T4 = ExcelTool.getNpArrayFromSheet(excelData, u'T4','name')

            unit=''  #单位
            try:
                unit = excelData.sheet_by_name("Unit").cell_value(0, 0)
            except Exception as e:
                unit = '未定义'  # 单位未定义
                # if (e.message.find("No sheet named") ==-1 ):
                #     unit='未定义'           #单位未定义
            result['unit'] = unit  # 单位
            for i in range(0,len(Tot[0])-1):# 对Tot做处理，把对角线数据设为0
                Tot[i,i]=0
                Tot[i,len(Tot[0])-1]=0
                Tot[len(Tot[0])-1,i]=0

            for i in range(0,Tra.shape[1]-1):# Tra最后一行赋值为0
              Tra [189,i]=0

            Tra_sort=np.argsort(-Tra , axis=0)# 按列排序

            index_im = Tra_sort[:, 1]  # 第2列排序的索引值   第2列是进口总排序
            index_ex=Tra_sort[:, 0]    # 第1列排序的索引值  第1列是出口总排行
            import_data = getImportData(country_name, Tra, Tot, index_im, country_num,index_ex)
            export_data = getExportData(country_name,Tra,Tot,index_ex,country_num,index_im)
            result["exportData"]=export_data
            result["importData"]=import_data

            print (file + " end")
            result_list.append(result)
            #一个文件计算完毕
        except BaseException:
            print ("Error: 文件有问题,"+file)
            import traceback
            traceback.print_exc()
            errMsg+=file+"<br/>"
    # if len(errMsg)!= 0:
    #     result_list
    result_list_json=json.dumps(result_list)
    print ("返回值 result_list_json :")
    print   (result_list_json)
    return  (result_list_json)


#  ， 获取某个国家的进口 排序数据
def getImportData(country_name,Tra,Tot,index_im,country_num,index_ex):
    importData_list=[]
    for i in range(0,country_num):
        importData={}
        name = country_name[index_im[i]][0]
        sum = Tra[index_im[i], 1]
        importData["name"] = name
        importData["sum"] = round(sum,2)
        importData["type"] = "import"
        importData["sort"] = i+1
        importData["countryNum"] = country_num
        # 第二级排序
        Tot_sort = np.argsort(-Tot, axis=0)  # 按列排序
        _index = Tot_sort[ : , index_im[i]]  # 二级排序 : 此国家的进口数据的排序
        _list = []
        for j in range(0,country_num):
            _data = {}
            _name = country_name[_index[j]][0]
            _data["name"] = _name
            _data["sort"] = j + 1
            _data["value"] = round(Tot[_index[j] ,index_im[i]],2)
            _data["sum"] =  round(Tra[_index[j],0],2)
            _list.append(_data)
        importData["data"] = _list
        importData_list.append(importData)
    return importData_list

#  ， 获取某个国家的出口 排序数据
def getExportData(country_name,Tra,Tot,index_ex,country_num,index_im):
    exportData_list=[]
    for i in  range (0,country_num):
        exportData={}
        name=country_name[index_ex[i]][0]
        sum=Tra[index_ex[i], 0]
        exportData["name"]=name
        exportData["sum"] = round(sum,2)
        exportData["type"]="export"
        exportData["sort"]=i+1
        exportData["countryNum"]=country_num
        #第二级排序
        Tot_sort = np.argsort(-Tot, axis=1)  # 按行排序
        _index=Tot_sort[index_ex[i],: ]      #  二级排序 : 此国家的出口数据的排序
        _list=[]                                   #
        for j in range(0,country_num):
            _data={}
            _name=country_name[_index[j]][0]
            _data["name"]= _name
            _data["sort"]= j+1
            _data["value"]= round(Tot[index_ex[i],_index[j]],2)
            _data["sum"]=  round(Tra[_index[j],1],2)
            _list.append(_data)
        exportData["data"]=_list
        exportData_list.append(exportData)
    return exportData_list


#
# rank_result()
# print "END "