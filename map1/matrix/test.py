from numpy import *
import numpy as np
import pandas as pd
import csv, sys

# E  :  E.csv
#
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
a1=np.mat([[1],[2],[3],[4],[5]]);
print("a1:\n",a1,"\n a1.shape:",a1.shape)
# a2=a1.T
a2=np.mat([
    [1,2,3,4],
    [5,6,7,8],
    [9,0,12,13]]
)
print("a2:\n",a2,"\n a2.shape:",a2.shape)

# print((a1).dot(a2))

#一维数组
arr=array(range(5))
print("arr: ",arr)
print("arr.shape",shape(arr))
if(arr.size == 5):

    print(arr.size)

# arr.reshape(-1,1)
# print(shape(arr))
# print(shape(arr.reshape(-1,1).T))
#二维数组
# arr=array([[1,2,3], [4,5,6]])
# print(arr)
# print(shape(arr))