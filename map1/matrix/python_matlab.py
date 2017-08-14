#coding:utf-8
#!/usr/bin/python
# python调用matlab

import matlab
import matlab.engine
import time
from mlab.releases import latest_release
from matlab import matlabroot

from win32com.client import Dispatch

if __name__ == '__main__':
    print "matlab运行路径", matlabroot()
    h = Dispatch("Matlab.application")
    print '调用开始！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    h.execute("matlab_2()")  # 执行matlab_1 函数，给定两个量
    print '调用结束！',time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))


    # eng = matlab.engine.start_matlab('MATLAB_\R2016b')
    # a = eng.sqrt(9.0)
    # print type(a), a
    #
    #
    # A = matlab.double([[8, 6, 9, 9], [9, 0, 9, 4,],[1, 2, 1, 8],[9, 5, 9, 1]])
    # print(A)
    # B = eng.pinv(A)
    # print(B)
    # eng.quit()


    pass

# a=[[8 ,    6  ,   9,     9],
#    [9  ,   0  ,   9   ,  4],
#    [1   ,  2    , 1   ,  8],
#    [9   ,  5  ,   9    , 1]]
#
# b= np.array(a)
# c=np.linalg.pinv(b)
# print(c)


