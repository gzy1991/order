import numpy as np
import pandas as pd
import csv, sys
import time
# E  :  E.csv
# matrix :data.csv，，     T
# matrix_1: matrix的行和
# FD  :    FD.csv          FD

#
#  start =time.time()
# 	time.sleep(2)
# 	end =time.time()
# 	print("运行时间",(end - start)//1)

start_all =time.time()
E = []
filename = 'C:/work/data/E.csv'
print('**********************************')
start =time.time()
with open(filename) as f:
    reader = csv.reader(f)
    try:
        for row in reader:
            if len(row) == 0:
                E.append(0)
            else:
                E.append(float(row[0]))
            # print(row)
        E.append(0)
    except csv.Error as e:
        sys.exit('file {}, line {}: {}'.format(filename, reader.line_num, e))
E = np.array(E)
E[4914]=176000.0
if(E.size == 4916):
    E = E[0:4915]
    print("E.csv,shape : ", E.shape)
end =time.time()
print ("E.csv读取完成：",E.shape)
print("耗时：",(end - start)//1,"秒 ，时间：",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')

# print E, type(E), E.T, type(E[31]), len(E)
start =time.time()
T = np.loadtxt('C:/work/data/data.csv', delimiter=',', skiprows=0)
# matrix = np.mat(matrix)
end =time.time()
print ("data.csv读取完成：",T.shape)  # 4915*4915
print("耗时：",(end - start)//1,"秒，时间： ",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')
for i in range(0,4914):
    for j in range(0,4914):
        if(T[i,j]*10000%1>0):
            T[i,j]=round(T[i,j]*10000)/10000   # 精确到小数点后4位
T_1 = np.zeros((4915, 1))         #matrix的行和
for i in range(0, 4914):
    T_1[i][0] = T[i, :].sum()
# print T_1, T_1.shape

start =time.time()
FD = np.loadtxt('C:/work/data/FD.csv', delimiter=',',skiprows=0)    # 4915*1140
for i in range(0,4914):
    for j in range(0,1139):
        if(FD[i,j]*10000%1>0):
            FD[i,j]=round(FD[i,j]*10000)/10000   # 精确到小数点后4位
end =time.time()
print ("FD.csv读取完成 ，shape: %s" % str(FD.shape))
print("耗时：",(end - start)//1,"秒 ，时间：",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')
FD_1 = np.zeros((4915, 1))              #FD 的行和
for i in range(0, 4914):
    FD_1[i][0] = FD[i, :].sum()
#FD_1 = FD.sum(1)
print("FD_1 shape:",str(FD_1.shape) )  #  FD_1.shape: 4915 * 1140
# print "FD_1 shape: %s " % str(FD_1.shape)

X = T_1 + FD_1                             #  X=T1+FD1;

#X_1 = np.diag(X)                                  # X1=diag(X);矩阵的对角线元素
#X_1=np.diag(np.diag(X))
X_1=np.diag(X.T.tolist()[0])
# print np.array(X_1).shape
Z = X_1 - T                                  # Z=X1-T;
# print Z
Z1 = np.linalg.pinv(Z)                              # Z1=pinv(Z); 伪逆矩阵
# print Z1.shape, (E.T).shape
it = (E.reshape(-1,1).T).dot(Z1)  # 4915*4915     #  int=E'*Z1;  .T:转置矩阵     ,  .dot :矩阵的乘积
print ("it 的shape:",it.shape," , np 的shape:", np.diag(it))


writer2= pd.ExcelWriter('C:/work/data/'+'outFile_17600_3_tempData1.xlsx')

T1_df= pd.DataFrame(T_1)
FD1_df= pd.DataFrame(FD_1)
X_df= pd.DataFrame(X)
it_df= pd.DataFrame(it)

T1_df.to_excel(writer2,"T1")
FD1_df.to_excel(writer2,"FD1")
X_df.to_excel(writer2,"X")
it_df.to_excel(writer2,"int")
writer2.save()

print("outFile_17600_3_tempData1导出成功")

writer3= pd.ExcelWriter('C:/work/data/'+'outFile_17600_3_tempData2.xlsx')
X1_df= pd.DataFrame(X_1)
Z1_df= pd.DataFrame(Z1)
Z_df= pd.DataFrame(Z)

X1_df.to_excel(writer3,"X1")
Z1_df.to_excel(writer3,"Z1")
Z_df.to_excel(writer3,"Z")
writer3.save()

print("outFile_17600_3_tempData2导出成功")
print("END")
end_all =time.time()

print("总体耗时：",(end_all-start_all)//1,"秒")
print("END")

#导出数据
# outFile='C:/work/data/'+'outFile1'+'.csv'
