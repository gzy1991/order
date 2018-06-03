#coding:utf-8
#!/usr/bin/python

#有些国家名需要切换，否则无法在echarts上正常映射数据
# 以下面的数据为例，把USA改为United States后，那么就可以映射数据。echarts里面只有United States，没有USA

#30个国家名对照表， 这30个国家名存在于countryExcel，但是不存在于counEchart中，
#需要转换
def getcountrySwitch():

    return {
        'Antigua':'Antigua and Barb.',
        'Aruba':'',
        'Bosnia and Herzegovina':'Bosnia and Herz.',
        'British Virgin Islands':'U.S. Virgin Is.',
        'Cayman Islands':'Cayman Is.',
        'Central African Republic':'Central African Rep.',
        'Czech Republic':'Central African Rep.',
        'Cote dIvoire':"Côte d'Ivoire",
        'North Korea':'Dem. Rep. Korea',
        'DR Congo':'Dem. Rep. Congo',
        'Dominican Republic':'Dominican Rep.',
        'French Polynesia':'Fr. Polynesia',
        'Hong Kong':'',
        'Laos':'Lao PDR',
        'Macao SAR':'',
        'Maldives':'',
        'Monaco':'',
        'Netherlands Antilles':'',
        'Gaza Strip':'',
        'South Korea':'Korea',
        'San Marino':'',
        'Sao Tome and Principe':'São Tomé and Principe',
        'South Sudan':'S. Sudan',
        'Taiwan':'',
        'TFYR Macedonia':'Macedonia',
        'Former USSR':'',
        'UAE':'United Arab Emirates',
        'UK':'United Kingdom',
        'USA':'United States',
        'Viet Nam':'Vietnam'
    }