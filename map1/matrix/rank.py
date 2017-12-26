#coding:utf-8
#!/usr/bin/python

# 批量读取结果文件，排序，
import os
import  sys
import xlrd
import xlwt
import numpy as np
import json




#获取国家名 地址列表
def get_country_name_array():
    L = []
    root_add = os.getcwd()
    country_dir = root_add + "\\country_excel\\Countries.xlsx"  # 结果excel所在目录
    excelData = xlrd.open_workbook(country_dir, "rb")
    Country_array = getArrayFromSheet(excelData,u'country')
    return Country_array

#获取结果excel 地址列表  ，只获取xls和xlsx文件
def get_file_name_list( ):
    L=[]
    root_add=os.getcwd()
    print(os.getcwd())                       # 获取工程根目录
    file_dir=root_add+"\\result_excel"     #  结果excel所在目录

    for root, dirs, files in os.walk(file_dir):
        for file in files:
            if os.path.splitext(file)[1] == '.xlsx' or  os.path.splitext(file)[1] == '.xls':
                L.append(os.path.join(root, file))
    return L

#排序
def rank_result():

    country_num = 5  # 前10个国家,这个参数可以从页面上传进来

    country_name =get_country_name_array()
    print(os.getcwd())
    files = get_file_name_list()
    print files  # .xlsx结果文件列表
    result_list=[]
    errMsg="";

    for file in files:  #批量读取

        try:
            result={}  #单个excel文件处理后的结果
            file_name = file.split("\\")[len(file.split("\\")) - 1].split(".")[0]
            result['importCountryNum'] = country_num
            result['exportCountryNum'] = country_num
            result["fileName"]=file_name
            print file+" start"
            excelData = xlrd.open_workbook(file,"rb")
            Tot  = getArrayFromSheet(excelData,u'Tot')
            FD_  = getArrayFromSheet(excelData,u'FD_S')
            Tra  = getArrayFromSheet(excelData,u'Tra')
            FD4  = getArrayFromSheet(excelData,u'FD4')
            T4  = getArrayFromSheet(excelData,u'T4')
            unit=''  #单位
            try:
                unit = excelData.sheet_by_name("Unit").cell_value(0, 0)
            except Exception, e:
                if (e.message.find("No sheet named") ==-1 ):
                    unit='未定义'           #单位未定义
            result['unit'] = unit  # 单位
            for i in range(0,len(Tot[0])-1):# 对Tot做处理，把对角线数据设为
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

            # for i in range (0,country_num):    #针对每个国家，获取国家名，以及贸易对象的排名
            #     print country_name[index_ex[189 - i]][0].encode("utf-8")  ,Tra[index_ex[189 - i], 0]
            print file + " end"
            result_list.append(result)
            #一个文件计算完毕
        except BaseException:
            print "Error: 文件有问题,"+file
            errMsg+=file+"<br/>"
    # if len(errMsg)!= 0:
    #     result_list
    result_list_json=json.dumps(result_list)
    print "返回值 result_list_json :"
    print   result_list_json
    return  result_list_json

# 从excel获取sheet， 转化成 numpy.array
def getArrayFromSheet(excelData,sheetName ):
    sheet=excelData.sheet_by_name(sheetName)
    row=sheet.nrows
    column = sheet.ncols  # 列
    _array=[]
    for i in range(0,row):
        _row=[]
        for j in range(0, column):
            _row.append(sheet.cell_value(i,j))
        _array.append(_row)
    np_array=np.array(_array)
    return np_array


#  ， 获取某个国家的进口 排序数据
def getImportData(country_name,Tra,Tot,index_im,country_num,index_ex):
    importData_list=[]
    for i in range(0,country_num):
        importData={}
        name = country_name[index_im[i]][0].encode("utf-8")
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
            _name = country_name[_index[j]][0].encode("utf-8")
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
        name=country_name[index_ex[i]][0].encode("utf-8")
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
            _name=country_name[_index[j]][0].encode("utf-8")
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