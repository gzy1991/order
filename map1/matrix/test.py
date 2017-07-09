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

FD = np.loadtxt('C:/work/data/FD.csv', delimiter=',',skiprows=0)    # 4915*1140
print ("FD shape: %s" % str(FD.shape))
FD_1 = np.zeros((4915, 1))              #FD 的行和
for i in range(0, 4915):
    FD_1[i][0] = FD[i, :].sum()
FD_1 = FD.sum(1)
print("FD_1 shape:",str(FD_1.shape) )