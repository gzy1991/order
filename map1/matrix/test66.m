function test66(FD_address,E_address,T_address, result_name)
msgbox( strcat(FD_address,E_address,T_address, result_name))
format long

msgbox( strcat('matlab process Start!Time：',datestr(now,31)))

FD= csvread(FD_address);
E= csvread(E_address);
T= csvread(T_address);

msgbox(strcat('ALl computer sucess!time：',datestr(now,31)))
xlswrite(result_name, E, 'E')

msgbox(strcat('export Success! address is : ',result_name))










end


