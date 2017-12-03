#coding:utf-8
#!/usr/bin/python
# 删除功能   ：  删除result_excel文件夹下的文件

import os
import os.path



def deleteData(fileNameList):
    root_add = os.getcwd()
    file_dir = root_add + "\\result_excel"  # 结果excel所在目录
    nameList=fileNameList.split(",")
    resString=""
    for fileName in nameList:
        file_address=file_dir+"\\"+fileName+".xls"
        os.remove(file_address)
        resString=resString+",<br>"+fileName+".xls"
    resString=resString[1:len(resString)]
    return "以下数据文件删除成功："+resString
