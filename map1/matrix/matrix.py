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
if(E.size == 4916):
    E = E[0:4915]
    print("E.csv,shape : ", E.shape)
end =time.time()
print ("E.csv读取完成：",E.shape)
print("耗时：",(end - start)//1,"秒 ，时间：",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')

# print E, type(E), E.T, type(E[31]), len(E)
start =time.time()
matrix = np.loadtxt('C:/work/data/data.csv', delimiter=',', skiprows=0)
# matrix = np.mat(matrix)
end =time.time()
print ("data.csv读取完成：",matrix.shape)  # 4915*4915
print("耗时：",(end - start)//1,"秒，时间： ",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')
matrix_1 = np.zeros((4915, 1))         #matrix的行和
for i in range(0, 4915):
    matrix_1[i][0] = matrix[i, :].sum()
# print matrix_1, matrix_1.shape

start =time.time()
FD = np.loadtxt('C:/work/data/FD.csv', delimiter=',',skiprows=0)    # 4915*1140
end =time.time()
print ("FD.csv读取完成 ，shape: %s" % str(FD.shape))
print("耗时：",(end - start)//1,"秒 ，时间：",time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),'\n','**********************************')
FD_1 = np.zeros((4915, 1))              #FD 的行和
for i in range(0, 4915):
    FD_1[i][0] = FD[i, :].sum()
FD_1 = FD.sum(1)
print("FD_1 shape:",str(FD_1.shape) )
# print "FD_1 shape: %s " % str(FD_1.shape)

X = matrix_1 + FD_1                             #  X=T1+FD1;

#X_1 = np.diag(X)                                  # X1=diag(X);矩阵的对角线元素
X_1=np.diag(np.diag(X))
# print np.array(X_1).shape
Z = X_1 - matrix                                  # Z=X1-T;
# print Z
Z1 = np.linalg.pinv(Z)                              # Z1=pinv(Z); 伪逆矩阵
# print Z1.shape, (E.T).shape
it = (E.reshape(-1,1).T).dot(Z1)  # 4915*4915     #  int=E'*Z1;  .T:转置矩阵     ,  .dot :矩阵的乘积
print ("it 的shape:",it.shape," , np 的shape:", np.diag(it))
#T_2 = np.diag(it).dot(matrix)  # 4915*4915          #T2=diag(int)*T;
T_2 = np.diag(tuple(it.tolist()[0])).dot(matrix)
print (T_2.shape, np.diag(it).shape)
#FD_2 = np.diag(it).dot(FD)                          # FD2=diag(int)*FD;
FD_2 = np.diag(tuple(it.tolist()[0])).dot(FD)                          # FD2=diag(int)*FD;
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

#FD_ = np.diag(FD_4)                                      # FD_=diag(FD4);
#FD_ = np.diag(FD_4)                                      # FD_=diag(FD4);

#tuple(FD_4.tolist()[0])
#np.diag(tuple(FD_4.tolist()))
FD_ =np.diag(tuple(np.diag(FD_4).tolist()))


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

Ex_3 = np.diag(Ex[:, 1])                             #Ex3=diag(Ex(:,2));
Ex_4 = Ex_3 - T_4                                       #Ex4=Ex3-T4;

Ex_5 = np.diag(Ex[:, 2])                                #Ex5=diag(Ex(:,3));
Ex_6 = Ex_5 - FD_4                                      #Ex6=Ex5-FD4;

Im_1 = np.diag(Im[:, 0])                                #Im1=diag(Im(:,1));
Im_2 = Im_1 - Tot                                       # Im2=Im1-Tot;

Im_3 = np.diag(Im[:, 1])                                #Im3=diag(Im(:,2));
Im_4 = Im_3 - T_4                                       #Im4=Im3-T4;

Im_5 = np.diag(Im[:, 2])                                # Im5=diag(Im(:,3));
Im_6 = Im_5 - FD_4                                      #Im6=Im5-FD4;

Tra = np.zeros((190, 6))
for i in range(0, 190):
    Tra[i][0] = Ex_2[i][i]                              #Tra(i,1)=Ex2(i,i);
    Tra[i][1] = Im_2[i][i]                              #Tra(i,2)=Im2(i,i);
    Tra[i][2] = Ex_4[i][i]                              #Tra(i,3)=Ex4(i,i);
    Tra[i][3] = Im_4[i][i]                              #Tra(i,4)=Im4(i,i);
    Tra[i][4] = Ex_6[i][i]                              #Tra(i,5)=Ex6(i,i);
    Tra[i][5] = Im_6[i][i]                              #Tra(i,6)=Im6(i,i);

a1 = T_2.sum()                                          #a1=sum(sum(T2));;
a2 = T_3.sum()                                          #a2=sum(sum(T3));;
a3 = T_4.sum()                                          #a3=sum(sum(T4));;
b1 = FD_2.sum()                                          #b1=sum(sum(T2));;
b2 = FD_3.sum()                                          #b2=sum(sum(T3));;
b3 = FD_4.sum()                                          # b3=sum(sum(T4));;

print( Tra)
print("END")
end_all =time.time()
print("总体耗时：",(end_all-start_all)//1,"秒")
print("END")