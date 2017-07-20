from numpy import *
import numpy as np
import pandas as pd
import csv, sys
import time
import xlwt
# E  :  E.csv
# http://blog.csdn.net/marksinoberg/article/details/52263975#xlwt
#
#

#

# E = []
# filename = 'C:/work/data/E.csv'
# with open(filename) as f:
#     reader = csv.reader(f)
#     try:
#         for row in reader:
#             if len(row) == 0:
#                 E.append(0)
#             else:
#                 E.append(float(row[0]))
#             # print(row)
#         E.append(0)
#     except csv.Error as e:
#         sys.exit('file {}, line {}: {}'.format(filename, reader.line_num, e))
# E = np.array(E)

# matrix = np.loadtxt('C:/work/data/data.csv', delimiter=',', skiprows=0)
# # matrix = np.mat(matrix)
# print (matrix.shape)  # 4915

# FD = np.loadtxt('C:/work/data/FD.csv', delimiter=',',skiprows=0)    # 4915*1140
# print ("FD shape: %s" % str(FD.shape))
# FD_1 = np.zeros((4915, 1))              #FD 的行和
# for i in range(0, 4915):
#     FD_1[i][0] = FD[i, :].sum()
# FD_1 = FD.sum(1)
# print("FD_1 shape:",str(FD_1.shape) )

# a1=np.mat([[1,1,3],[0,0,1]]);
# a1=np.mat([[1],[2],[3],[4],[5]]);
# print("a1:\n",a1,"\n a1.shape:",a1.shape)
## a2=a1.T
# a2=np.mat([
#     [1,2,3,4],
#     [5,6,7,8],
#     [9,0,12,13]]
# )
# print("a2:\n",a2,"\n a2.shape:",a2.shape)

# print((a1).dot(a2))

#一维数组
# arr=array(range(5))
# print("arr: ",arr)
# print("arr.shape",shape(arr))
# if(arr.size == 5):
#     print(arr.size)
#     arr=arr[0:4]
#     print("arr.shape", shape(arr))
#
# #
# tup=(1,2,3)
# print("diag函数：\n",np.diag(tup),"\nshape:\n",np.diag((1,2,3)).shape)


# arr.reshape(-1,1)
# print(shape(arr))
# print(shape(arr.reshape(-1,1).T))
#二维数组
# arr=array([[1,2,3], [4,5,6]])
# print(arr)
# print(shape(arr))
start =time.time()
end =time.time()
print("耗时：",(end - start)//1,"秒 ，时间：",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')


#导出到csv
# my_matrix=np.array([[1, 2], [3, 4]])
# print(my_matrix)
# outFile='C:/work/data/'+'outFile1'+'.csv'
# np.savetxt(outFile,my_matrix)

"""
Created on Sun Jun 18 20:57:34 2017

@author: Bruce Lau
"""


#写入到xlsx文件
# prepare for data
data = np.arange(1,101).reshape((10,10))
data_df = pd.DataFrame(data)

# change the index and column name
#data_df.columns = ['A','B','C','D','E','F','G','H','I','J']
#data_df.index = ['a','b','c','d','e','f','g','h','i','j']


# create and writer pd.DataFrame to excel
# writer = pd.ExcelWriter('C:/work/data/'+'Save_Excel.xlsx')
# data_df.to_excel(writer,'page_1')
# writer.save()
ii=data.shape[0]
jj=data.shape[1]
workbook = xlwt.Workbook()
sheet=workbook.add_sheet('table_message',cell_overwrite_ok=True)
for i in range(0,ii):
    for j in range(0,jj):
        print(data[i][j])
        sheet.write(i,j,data[i][j])

workbook.save('C:/work/data/'+'Sace_Excel_xlwt.xls')

