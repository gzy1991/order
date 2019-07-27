#coding:utf-8
#!/usr/bin/python
import Tool.country as CountrySwitchName

#  BR地区：63个国家
# 入参：
# 出参：63个国家的集合
def getBrCountryList():
    countrys= [
    "Albania",
    "China",
    "Belarus",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Czech Republic",
    "Estonia",
    "Hungary",
    "Latvia",
    "Lithuania",
    "Montenegro",
    "Poland",
    "Moldova",
    "Romania",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "TFYR Macedonia",
    "Ukraine",
    "Kazakhstan",
    "Kyrgyzstan",
    "Tajikistan",
    "Turkmenistan",
    "Uzbekistan",
    "Mongolia",
    "Russia",
    "Afghanistan",
    "Bangladesh",
    "Bhutan",
    "India",
    "Maldives",
    "Nepal",
    "Pakistan",
    "Sri Lanka",
    "Brunei",
    "Cambodia",
    "Indonesia",
    "Laos",
    "Malaysia",
    "Myanmar",
    "Philippines",
    "Singapore",
    "Thailand",
    "Viet Nam",
    "Armenia",
    "Azerbaijan",
    "Bahrain",
    "Egypt",
    "Georgia",
    "Iran",
    "Iraq",
    "Israel",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Gaza Strip",
    "Oman",
    "Qatar",
    "Saudi Arabia",
    "Syria",
    "Turkey",
    "UAE",
    "Yemen"
    ]
    countrySwitch=CountrySwitchName.getcountrySwitch()
    newCountrys=[]
    for coun in countrys:

        # if(countrySwitch.has_key(coun) and countrySwitch[coun] !=""):
        if((coun in countrySwitch)  and countrySwitch[coun] !=""):
            newCountrys.append(countrySwitch[coun])
        else:
            newCountrys.append(coun)
    return newCountrys
    # if(coun in newCountrys):
    #     return True
    # else:
    #     return False