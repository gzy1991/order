#coding:utf-8
#!/usr/bin/python

import matlab.engine

eng = matlab.engine.start_matlab()
print(eng.callentry(7.7, 2.1, nargout=3))
eng.quit()

#       2019年6月2日18:14:17
#       使用python3.5调用matlab2016b
#       https://www.cnblogs.com/stacklike/p/8279277.html#matlab_4
#       测试成功