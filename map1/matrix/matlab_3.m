function matlab_3(FD_address,E_address,T_address, result_name)

format long

msgbox( strcat('matlab process Start!Time：',datestr(now,31)))

FD= csvread(FD_address);
E= csvread(E_address);
E(4915,1)=176000;
%  E(4915,1)=176000;
%  E(4915,1)=-17600;
% 1060  176000  -17600

msgbox( strcat('E(4915,1):',num2str(E(4915,1)))  )
T= csvread(T_address);

msgbox( strcat ('read csv file success!time:',datestr(now,31)))

% % E= textread('E.csv')

for i=1:4915;

T1(i,1)=sum(T(i,:));

end;


for i=1:4915;

FD1(i,1)=sum(FD(i,:));

end;

X=T1+FD1;

X1=diag(X);
Z=X1-T;
msgbox(strcat('T1、FD1、X1、Z compute success!time：',datestr(now,31)))

Z1=pinv(Z);

int=E'*Z1;

T2=diag(int)*T;

FD2=diag(int)*FD;
% msgbox(strcat('Z1、int、T2、FD2 compute success!time：',datestr(now,31)))


for i=1:4914;
for j=1:189;

T3(i,j)=sum(T2(i,(j-1)*26+1:j*26));

end;
end;



for i=1:4914;
for j=1:190;

FD3(i,j)=sum(FD2(i,(j-1)*6+1:j*6));

end;
end;


for i=1:189;
for j=1:189;
T4(j,i)=sum(T3((j-1)*26+1:j*26,i));
end;
end;



for i=1:190;
for j=1:189;
FD4(j,i)=sum(FD3((j-1)*26+1:j*26,i));
end;
end;


for i=1:189;
T4(190,i)=sum(T2(4915,(i-1)*26+1:i*26));
end;


for i=1:189;
T4(i,190)=sum(T2((i-1)*26+1:i*26,4915));
end;


for i=1:190;
FD4(190,i)=sum(FD2(4915,(i-1)*6+1:i*6));
end;


Tot=FD4+T4;
FD_=diag(FD4);


for i=1:190;
Ex(i,1)=sum(Tot(i,:));
Ex(i,2)=sum(T4(i,:));
Ex(i,3)=sum(FD4(i,:));
Im(i,1)=sum(Tot(:,i))';
Im(i,2)=sum(T4(:,i))';
Im(i,3)=sum(FD4(:,i))';
end;


Ex1=diag(Ex(:,1));
Ex2=Ex1-Tot;
for i=1:190;
Tra(i,1)=Ex2(i,i);
end;

Ex3=diag(Ex(:,2));
Ex4=Ex3-T4;
for i=1:190;
Tra(i,3)=Ex4(i,i);
end;

Ex5=diag(Ex(:,3));
Ex6=Ex5-FD4;
for i=1:190;
Tra(i,5)=Ex6(i,i);
end;

Im1=diag(Im(:,1));
Im2=Im1-Tot;
for i=1:190;
Tra(i,2)=Im2(i,i);
end;

Im3=diag(Im(:,2));
Im4=Im3-T4;
for i=1:190;
Tra(i,4)=Im4(i,i);
end;

Im5=diag(Im(:,3));
Im6=Im5-FD4;
for i=1:190;
Tra(i,6)=Im6(i,i);
end;


a1=sum(sum(T2));;
a2=sum(sum(T3));;
a3=sum(sum(T4));;
b3=sum(sum(T4));;
b2=sum(sum(T3));;
b1=sum(sum(T2));;
msgbox(strcat('ALl computer sucess!time：',datestr(now,31)))
xlswrite(result_name, T4, 'T4')
xlswrite(result_name, FD4, 'FD4')
xlswrite(result_name, Tra, 'Tra')
xlswrite(result_name, FD_, 'FD_')
xlswrite(result_name, Tot,'Tot')

msgbox(strcat('export Success! address is : ',result_name))










end


