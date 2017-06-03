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


你的result.xls里面，有些国家是写岛国，有些国家是些袖珍国家，排序肯定排不上他们，没有显示的必要
还有些，比如 taiwan，新加坡，怎么处理，

Andorra 安道尔公国
Antigua  安提瓜和巴布达
Aruba     阿鲁巴   一个小岛
Bahamas 巴哈马
Bahrain  巴林
Barbados   巴巴多斯
British Virgin Islands   英属维尔京群岛
Cape Verde     佛得角
Cayman Islands  开曼群岛
Congo              刚果                                                   (对应地图中的Republic of the Congo)
Cote dIvoire      科特迪瓦
DR Congo         刚果民主共和国                                      (对应地图中的Democratic Republic of the Congo)
Former USSR     前苏联                （数据里已经有俄罗斯了，这个前苏联还处理吗，这些数据是1991年之前的吗，还是之后的）
French Polynesia  法属波利尼西亚                                （岛国，）
Gaza Strip       加沙地带
Hong Kong   香港
Liechtenstein  列支敦士登                                             （袖珍国家）
Macao SAR   澳门特区
Maldives      马尔代夫                                                 （岛国，）
Malta           马耳他                                                  （袖珍国家）
Mauritius     毛里求斯                                             （岛国，）
Monaco       摩纳哥                                               （袖珍国家）
Netherlands Antilles   荷属安的列斯                     （岛国）
Samoa                       萨摩亚                                （岛国）
San Marino    圣马力诺                                        （袖珍国家）
Sao Tome and Principe   圣多美和普林西比              （岛国）
Serbia                塞尔维亚         （对应地图中的Republic of Serbia）
Seychelles           塞舌尔
Singapore         新加坡
Taiwan            台湾
Tanzania           坦桑尼亚         （对应地图中的United Republic of Tanzania）
TFYR Macedonia  马其顿          （对应地图中的 Macedonia）
UAE                  阿联酋            （对应地图中的 United Arab Emirates）
UK                    联合王国        （对应地图中的 United Kingdom）
USA                  美国              （对应地图中的 United States of America）
Viet Nam          越南               （对应地图中的 Vietnam）