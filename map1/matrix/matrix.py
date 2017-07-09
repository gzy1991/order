import numpy as np
import pandas as pd
import csv, sys

# E  :  E.csv
# matrix :data.csv，，     T
# matrix_1: matrix的行和
# FD  :    FD.csv          FD

#

E = []
filename = 'C:/work/data/E.csv'
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
print ("E.csv读取完成：",E.shape)

# print E, type(E), E.T, type(E[31]), len(E)
matrix = np.loadtxt('C:/work/data/data.csv', delimiter=',', skiprows=0)
# matrix = np.mat(matrix)
print ("data.csv读取完成：",matrix.shape)  # 4915*4915

matrix_1 = np.zeros((4915, 1))         #matrix的行和
for i in range(0, 4915):
    matrix_1[i][0] = matrix[i, :].sum()
# print matrix_1, matrix_1.shape

FD = np.loadtxt('C:/work/data/FD.csv', delimiter=',',skiprows=0)    # 4915*1140
print ("FD.csv读取完成 ，shape: %s" % str(FD.shape))

FD_1 = np.zeros((4915, 1))              #FD 的行和
for i in range(0, 4915):
    FD_1[i][0] = FD[i, :].sum()
FD_1 = FD.sum(1)
print("FD_1 shape:",str(FD_1.shape) )
# print "FD_1 shape: %s " % str(FD_1.shape)

X = matrix_1 + FD_1                             #  X=T1+FD1;

X_1 = np.diag(X)                                  # X1=diag(X);矩阵的对角线元素
# print np.array(X_1).shape
Z = X_1 - matrix                                  # Z=X1-T;
# print Z
Z1 = np.linalg.pinv(Z)                              # Z1=pinv(Z); 伪逆矩阵
# print Z1.shape, (E.T).shape
it = (E.T).dot(Z1)  # 4915*4915     #  int=E'*Z1;  .T:转置矩阵     ,  .dot :矩阵的乘积
print ("it 的shape:",it.shape," , np 的shape:", np.diag(it))
T_2 = np.diag(it).dot(matrix)  # 4915*4915          #T2=diag(int)*T;
print (T_2.shape, np.diag(it).shape)
FD_2 = np.diag(it).dot(FD)                          # FD2=diag(int)*FD;
T_3 = np.zeros((4914, 189))                         # 4914*189的 全0 矩阵
for i in range(0, 4914):
    for j in range(0, 189):
        # print j
        start = j*26
        end = (j+1)*26 - 1
        # print T_2[i][int(start):int(end)].sum(0)
        T_3[i][j] = T_2[i, int(start):int(end)].sum(0)        #T3(i,j)=sum(T2(i,(j-1)*26+1:j*26));
print (T_3, type(T_3))
FD_3 = np.zeros((4914, 190))
for i in range(0, 4914):
    for j in range(0,190):
        FD_3[i][j] = FD_2[i, j*26:(j+1)*26-1].sum(0)          # FD3(i,j)=sum(FD2(i,(j-1)*6+1:j*6));
print (FD_3.shape)

T_4 = np.zeros((190, 190))
for i in range(0, 189):
    for j in range(0, 189):
        T_4[j][i] = T_3[j*26:(j+1)*26-1, i].sum(0)        # T4(j,i)=sum(T3((j-1)*26+1:j*26,i));

FD_4 = np.zeros((190, 190))
for i in range(0, 190):
    for j in range(0, 189):
        FD_4[j][i] = FD_3[j*26:(j+1)*26-1, i].sum(0)      # FD4(j,i)=sum(FD3((j-1)*26+1:j*26,i));

for i in range(0, 189):
    T_4[189][i] = T_2[4913,i*26:(i+1)*26-1].sum(0)       #T4(190,i)=sum(T2(4915,(i-1)*26+1:i*26));
for i in range(0, 189):
    T_4[i][189] = T_2[i*26:(i+1)*26-1, 4913].sum(0)        #T4(i,190)=sum(T2((i-1)*26+1:i*26,4915));
for i in range(0, 190):
    FD_4[189][i] = FD_2[4913, i*6:(i+1)*6-1].sum(0)      # FD4(190,i)=sum(FD2(4915,(i-1)*6+1:i*6));
Tot = FD_4 + T_4                                         # Tot=FD4+T4;
FD_ = np.diag(FD_4)                                      # FD_=diag(FD4);
Ex = np.zeros((190, 3))
Im = np.zeros((190, 3))
for i in range(0, 190):
    Ex[i][0] = Tot[i, :].sum(0)                          # Ex(i,1)=sum(Tot(i,:));
    Ex[i][1] = T_4[i, :].sum(0)                         # Ex(i,2)=sum(T4(i,:));
    Ex[i][2] = FD_4[i, :].sum(0)                        #Ex(i,3)=sum(FD4(i,:));
    Im[i][0] = Tot[:, i].sum(0)                         #Im(i,1)=sum(Tot(:,i))';
    Im[i][1] = T_4[:, i].sum(0)                         #Im(i,2)=sum(T4(:,i))';
    Im[i][2] = FD_4[:, i].sum(0)                        #Im(i,3)=sum(FD4(:,i))';

Ex_1 = np.diag(Ex[:, 0])                                # Ex1=diag(Ex(:,1));
Ex_2 = Ex_1 - Tot                                       # Ex2=Ex1-Tot;

Ex_3 = np.diag(Ex[:, 1])
Ex_4 = Ex_3 - T_4

Ex_5 = np.diag(Ex[:, 2])
Ex_6 = Ex_5 - FD_4

Im_1 = np.diag(Im[:, 0])
Im_2 = Im_1 - Tot

Im_3 = np.diag(Im[:, 1])
Im_4 = Im_3 - T_4

Im_5 = np.diag(Im[:, 2])
Im_6 = Im_5 - FD_4

Tra = np.zeros((190, 6))
for i in range(0, 190):
    Tra[i][0] = Ex_2[i][i]
    Tra[i][1] = Im_2[i][i]
    Tra[i][2] = Ex_4[i][i]
    Tra[i][3] = Im_4[i][i]
    Tra[i][4] = Ex_6[i][i]
    Tra[i][5] = Im_6[i][i]

a1 = T_2.sum()
a2 = T_3.sum()
a3 = T_4.sum()
b1 = FD_2.sum()
b2 = FD_3.sum()
b3 = FD_4.sum()

print( Tra)
print("END")