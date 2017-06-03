#!/usr/bin/env python3
#coding: utf-8

import  xdrlib ,sys
import xlrd
import map1.nameMap as nameMap
# 安装命令 ： pip install xlrd
# 教程 http://www.cnblogs.com/lhj588/archive/2012/01/06/2314181.html

#读取excel
data = xlrd.open_workbook('C:/work/data/country.xlsx')

# 获取一个工作表
sheet =data.sheets()[0]
#sheet2 = data.sheet_by_name('Sheet1')
#sheet3 = data.sheet_by_index(0) #通过索引顺序获取

# 获取整行和整列的值（数组）
# table.row_values(i)
# table.col_values(i)

# 第一列的值
columnValueList = sheet.col_values(0)

# 获取行数和列数
# nrows = table.nrows
# ncols = table.ncols

rowNum=sheet.nrows  # 行数
print("excel中国家个数:",rowNum)
# 循环行列表数据
for i in range(rowNum):
    # 如果名字存在
    if(columnValueList[i] not in nameMap.nameMap):
        print(columnValueList[i])

#出口前10
#列表有序
ret=[
    {
        "name":"",                    #出口国
        "chineseName":"",
        "type":"output",               #input是进口
        "sum":213,                       #进口或出口总和，不能为负数
        "sort":1,                       #排序
        "output":[
             {"name":"a",   "chineseName":"",   "sort":1,   "value":123},
             {"name":"b",   "chineseName":"",   "sort":2,   "value":34},
             {"name":"c",   "chineseName":"",   "sort":3,   "value":55}
        ]
    },

    {},
    {},
    {},
    {},
]

