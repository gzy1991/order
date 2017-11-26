% 测试文件

function sum_AB = test8(FD_address,E_address,T_address, result_name)

    format long
    msgbox( strcat('matlab process Start!Time：',datestr(now,31)))
    FD= csvread(FD_address);
    E= csvread(E_address);
    msgbox( strcat('E(4915,1):',num2str(E(4915,1)))  )
    T= csvread(T_address);
    msgbox( strcat ('read csv file success!time:',datestr(now,31)))

load chirp
sound(y,Fs)
pause(2)

sound(y,Fs)
pause(2)

sound(y,Fs)
end
