/**
 * Created by  on 2017/6/12.
 */


/* 侧边栏切换形态 */
/*$(".navbar-side a").click(function(){
    $("body").toggleClass("sidebar-collapse");
    if($("body").hasClass("sidebar-collapse")){
        $(".sidebar > h4").html("表格");
    }else{
        $(".sidebar > h4").html("数据表格");
    }
    return false;
})
$(".sidenav>li>a").click(function(){
    $(this).addClass("hover");
    $(this).next().slideToggle();
    $(this).parent().siblings().children("a").removeClass("hover").next().slideUp();

})*/

var browserHeight=$(window).height() ; //浏览器高度
var browserWidth=$(window).width();//浏览器宽度
/*$("div.form-group").height(browserHeight+"px");
$("div.form-group").width(browserWidth+"px");*/

/*$("div.main").height((browserHeight-100)+"px");*/

/*$("#tableDiv").height((browserHeight-100)+"px");*/






$('#tableContainer').bootstrapTable({
    columns: [{
        field: 'id',
        title: '标题'
    }],
    data: [
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },{
        id: "2016年中国数据"

    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },{
        id: "2016年中国数据"

    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },{
        id: "2016年中国数据"

    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },{
        id: "2016年中国数据"

    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },{
        id: "2016年中国数据"

    }, {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },
    {
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    },{
        id: "2016年中国数据"

    }, {
        id: '2016年全球数据数据'
    }]
});

var dom = document.getElementById("mapContainer");
var myChart = echarts.init(dom);
var app = {};
option = null;





/*  169 个 国家 坐标  */
var countrytInfo={
'Guyana': {'name': 'Guyana', 'latitude': 4.860416, 'longitude': -58.93018, 'chineseName': '圭亚那', 'code': 'GY'},
'Greece': {'name': 'Greece', 'latitude': 39.074208, 'longitude': 21.824312, 'chineseName': '希腊', 'code': 'GR'},
'Azerbaijan': {'name': 'Azerbaijan', 'latitude': 40.143105, 'longitude': 47.576927, 'chineseName': '阿塞拜疆', 'code': 'AZ'},
'Macedonia, FYR': {'chineseName': '', 'code': 'MK', 'name': 'Macedonia, FYR'},
'Taiwan': {'chineseName': '台湾', 'code': 'TW', 'name': 'Taiwan'},
'Benin': {'name': 'Benin', 'latitude': 9.30769, 'longitude': 2.315834, 'chineseName': '贝宁', 'code': 'BJ'},
"Cote dIvoire": {'chineseName': '', 'code': 'CI', 'name': "Cote dIvoire"},
'Djibouti': {'name': 'Djibouti', 'latitude': 11.825138, 'longitude': 42.590275, 'chineseName': '吉布提', 'code': 'DJ'},
'Ecuador': {'name': 'Ecuador', 'latitude': -1.831239, 'longitude': -78.18340599999999, 'chineseName': '厄瓜多尔', 'code': 'EC'},
'North Korea': {'chineseName': '', 'code': 'KP', 'name': 'North Korea'},
'Paraguay': {'name': 'Paraguay', 'latitude': -23.442503, 'longitude': -58.443832, 'chineseName': '巴拉圭', 'code': 'PY'},
'Cyprus': {'name': 'Cyprus', 'latitude': 35.126413, 'longitude': 33.429859, 'chineseName': '塞浦路斯', 'code': 'CY'},
'Cameroon': {'name': 'Cameroon', 'latitude': 7.369721999999999, 'longitude': 12.354722, 'chineseName': '喀麦隆', 'code': 'CM'},
'Costa Rica': {'name': 'Costa Rica', 'latitude': 9.748916999999999, 'longitude': -83.753428, 'chineseName': '哥斯达黎加', 'code': 'CR'},
'Chad': {'name': 'Chad', 'latitude': 15.454166, 'longitude': 18.732207, 'chineseName': '乍得', 'code': 'TD'},
'Ethiopia': {'name': 'Ethiopia', 'latitude': 9.145000000000001, 'longitude': 40.489673, 'chineseName': '埃塞俄比亚', 'code': 'ET'},
'Somalia': {'name': 'Somalia', 'latitude': 5.152149, 'longitude': 46.199616, 'chineseName': '索马里', 'code': 'SO'},
'Mexico': {'name': 'Mexico', 'latitude': 23.634501, 'longitude': -102.552784, 'chineseName': '墨西哥', 'code': 'MX'},
'El Salvador': {'name': 'El Salvador', 'latitude': 13.794185, 'longitude': -88.89653, 'chineseName': '萨尔瓦多', 'code': 'SV'},
'Syria': {'name': 'Syria', 'latitude': 34.80207499999999, 'longitude': 38.996815, 'chineseName': '叙利亚', 'code': 'SY'},
'Iceland': {'name': 'Iceland', 'latitude': 64.963051, 'longitude': -19.020835, 'chineseName': '冰岛', 'code': 'IS'},
'Brunei': {'name': 'Brunei', 'latitude': 4.535277, 'longitude': 114.727669, 'chineseName': '文莱', 'code': 'BN'},
'Slovenia': {'name': 'Slovenia', 'latitude': 46.151241, 'longitude': 14.995463, 'chineseName': '斯洛文尼亚', 'code': 'SI'},
'Botswana': {'name': 'Botswana', 'latitude': -22.328474, 'longitude': 24.684866, 'chineseName': '博茨瓦纳', 'code': 'BW'},
'Malawi': {'name': 'Malawi', 'latitude': -13.254308, 'longitude': 34.301525, 'chineseName': '马拉维', 'code': 'MW'},
'Papua New Guinea': {'name': 'Papua New Guinea', 'latitude': -6.314992999999999, 'longitude': 143.95555, 'chineseName': '巴布亚新几内亚', 'code': 'PG'},
'Liberia': {'name': 'Liberia', 'latitude': 6.428055, 'longitude': -9.429499000000002, 'chineseName': '利比里亚', 'code': 'LR'},
'Cape Verde': {'chineseName': '', 'code': 'CV', 'name': 'Cape Verde'},
'Mongolia': {'name': 'Mongolia', 'latitude': 46.862496, 'longitude': 103.846656, 'chineseName': '蒙古', 'code': 'MN'},
'Nicaragua': {'name': 'Nicaragua', 'latitude': 12.865416, 'longitude': -85.207229, 'chineseName': '尼加拉瓜', 'code': 'NI'},
'Burkina Faso': {'name': 'Burkina Faso', 'latitude': 12.238333, 'longitude': -1.561593, 'chineseName': '布基纳法索', 'code': 'BF'},
'Niger': {'name': 'Niger', 'latitude': 17.607789, 'longitude': 8.081666, 'chineseName': '尼日尔', 'code': 'NE'},
'Croatia': {'name': 'Croatia', 'latitude': 45.1, 'longitude': 15.2, 'chineseName': '克罗地亚', 'code': 'HR'},
'Jordan': {'name': 'Jordan', 'latitude': 30.585164, 'longitude': 36.238414, 'chineseName': '约旦', 'code': 'JO'},
'Turkey': {'name': 'Turkey', 'latitude': 38.963745, 'longitude': 35.243322, 'chineseName': '土耳其', 'code': 'TR'},
'Saudi Arabia': {'name': 'Saudi Arabia', 'latitude': 23.885942, 'longitude': 45.079162, 'chineseName': '沙特阿拉伯', 'code': 'SA'},
'Indonesia': {'name': 'Indonesia', 'latitude': -0.789275, 'longitude': 113.921327, 'chineseName': '印尼', 'code': 'ID'},
'Bulgaria': {'name': 'Bulgaria', 'latitude': 42.733883, 'longitude': 25.48583, 'chineseName': '保加利亚', 'code': 'BG'},
'Sweden': {'name': 'Sweden', 'latitude': 60.12816100000001, 'longitude': 18.643501, 'chineseName': '瑞典', 'code': 'SE'},
'Solomon Islands': {'name': 'Solomon Islands', 'latitude': -9.64571, 'longitude': 160.156194, 'chineseName': '所罗门群岛', 'code': 'SB'},
'France': {'name': 'France', 'latitude': 46.227638, 'longitude': 2.213749, 'chineseName': '法国', 'code': 'FR'},
'Nigeria': {'name': 'Nigeria', 'latitude': 9.081999, 'longitude': 8.675277, 'chineseName': '尼日利亚', 'code': 'NG'},
'Yemen, Rep.': {'chineseName': '', 'code': 'YE', 'name': 'Yemen, Rep.'},
'Trinidad and Tobago': {'name': 'Trinidad and Tobago', 'latitude': 10.691803, 'longitude': -61.222503, 'chineseName': '特里尼达和多巴哥', 'code': 'TT'},
'United Arab Emirates': {'name': 'United Arab Emirates', 'latitude': 23.424076, 'longitude': 53.847818, 'chineseName': '阿联酋', 'code': 'AE'},
'Latvia': {'name': 'Latvia', 'latitude': 56.879635, 'longitude': 24.603189, 'chineseName': '拉脱维亚', 'code': 'LV'},
'Dominican Rep.': {'chineseName': '', 'code': 'DO', 'name': 'Dominican Rep.'},
'Afghanistan': {'name': 'Afghanistan', 'latitude': 33.93911, 'longitude': 67.709953, 'chineseName': '阿富汗', 'code': 'AF'},
'Japan': {'name': 'Japan', 'latitude': 36.204824, 'longitude': 138.252924, 'chineseName': '日本', 'code': 'JP'},
'Bhutan': {'name': 'Bhutan', 'latitude': 27.514162, 'longitude': 90.433601, 'chineseName': '不丹', 'code': 'BT'},
'Sudan': {'name': 'Sudan', 'latitude': 12.862807, 'longitude': 30.217636, 'chineseName': '苏丹', 'code': 'SD'},
'Iraq': {'name': 'Iraq', 'latitude': 33.223191, 'longitude': 43.679291, 'chineseName': '伊拉克', 'code': 'IQ'},
'Comoros': {'chineseName': '', 'code': 'KM', 'name': 'Comoros'},
'Jamaica': {'name': 'Jamaica', 'latitude': 18.109581, 'longitude': -77.297508, 'chineseName': '牙买加', 'code': 'JM'},
'South Africa': {'name': 'South Africa', 'latitude': -30.559482, 'longitude': 22.937506, 'chineseName': '南非', 'code': 'ZA'},
'Ukraine': {'name': 'Ukraine', 'latitude': 48.379433, 'longitude': 31.16558, 'chineseName': '乌克兰', 'code': 'UA'},
'Chile': {'name': 'Chile', 'latitude': -35.675147, 'longitude': -71.542969, 'chineseName': '智利', 'code': 'CL'},
'Angola': {'name': 'Angola', 'latitude': -11.202692, 'longitude': 17.873887, 'chineseName': '安哥拉', 'code': 'AO'},
'Colombia': {'name': 'Colombia', 'latitude': 4.570868, 'longitude': -74.297333, 'chineseName': '哥伦比亚', 'code': 'CO'},
'Tajikistan': {'name': 'Tajikistan', 'latitude': 38.861034, 'longitude': 71.276093, 'chineseName': '塔吉克斯坦', 'code': 'TJ'},
'Sri Lanka': {'name': 'Sri Lanka', 'latitude': 7.873053999999999, 'longitude': 80.77179699999999, 'chineseName': '斯里兰卡', 'code': 'LK'},
'Mozambique': {'name': 'Mozambique', 'latitude': -18.665695, 'longitude': 35.529562, 'chineseName': '莫桑比克', 'code': 'MZ'},
'Albania': {'name': 'Albania', 'latitude': 41.153332, 'longitude': 20.168331, 'chineseName': '阿尔巴尼亚', 'code': 'AL'},
'Madagascar': {'name': 'Madagascar', 'latitude': -18.766947, 'longitude': 46.869107, 'chineseName': '马达加斯加', 'code': 'MG'},
'Norway': {'name': 'Norway', 'latitude': 60.47202399999999, 'longitude': 8.468945999999999, 'chineseName': '挪威', 'code': 'NO'},
'Tunisia': {'name': 'Tunisia', 'latitude': 33.886917, 'longitude': 9.537499, 'chineseName': '突尼斯', 'code': 'TN'},
'Sierra Leone': {'name': 'Sierra Leone', 'latitude': 8.460555, 'longitude': -11.779889, 'chineseName': '塞拉利昂', 'code': 'SL'},
'Equatorial Guinea': {'name': 'Equatorial Guinea', 'latitude': 1.650801, 'longitude': 10.267895, 'chineseName': '赤道几内亚', 'code': 'GQ'},
'Rwanda': {'name': 'Rwanda', 'latitude': -1.940278, 'longitude': 29.873888, 'chineseName': '卢旺达', 'code': 'RW'},
'Australia': {'name': 'Australia', 'latitude': -25.274398, 'longitude': 133.775136, 'chineseName': '澳大利亚', 'code': 'AU'},
'Kenya': {'name': 'Kenya', 'latitude': -0.023559, 'longitude': 37.906193, 'chineseName': '肯尼亚', 'code': 'KE'},
'Swaziland': {'name': 'Swaziland', 'latitude': -26.522503, 'longitude': 31.465866, 'chineseName': '斯威士兰', 'code': 'SZ'},
'Egypt': {'name': 'Egypt', 'latitude': 26.820553, 'longitude': 30.802498, 'chineseName': '埃及', 'code': 'EG'},
'Netherlands': {'name': 'Netherlands', 'latitude': 52.132633, 'longitude': 5.291265999999999, 'chineseName': '荷兰', 'code': 'NL'},
'Algeria': {'name': 'Algeria', 'latitude': 28.033886, 'longitude': 1.659626, 'chineseName': '阿尔及利亚', 'code': 'DZ'},
'Georgia': {'name': 'Georgia', 'latitude': 32.1656221, 'longitude': -82.9000751, 'chineseName': '格鲁吉亚', 'code': 'GE'},
'Italy': {'name': 'Italy', 'latitude': 41.87194, 'longitude': 12.56738, 'chineseName': '意大利', 'code': 'IT'},
'Estonia': {'name': 'Estonia', 'latitude': 58.595272, 'longitude': 25.013607, 'chineseName': '爱沙尼亚', 'code': 'EE'},
'South Korea': {'chineseName': '韩国','latitude':37, 'longitude':127.5, 'code': 'KR', 'name': 'South Korea'},
'Morocco': {'name': 'Morocco', 'latitude': 31.791702, 'longitude': -7.092619999999999, 'chineseName': '摩洛哥', 'code': 'MA'},
'Mauritius': {'chineseName': '', 'code': 'MU', 'name': 'Mauritius'},
'Turkmenistan': {'name': 'Turkmenistan', 'latitude': 38.969719, 'longitude': 59.556278, 'chineseName': '土库曼斯坦', 'code': 'TM'},
'Ghana': {'name': 'Ghana', 'latitude': 7.946527, 'longitude': -1.023194, 'chineseName': '加纳', 'code': 'GH'},
'Poland': {'name': 'Poland', 'latitude': 51.919438, 'longitude': 19.145136, 'chineseName': '波兰', 'code': 'PL'},
'Finland': {'name': 'Finland', 'latitude': 61.92410999999999, 'longitude': 25.748151, 'chineseName': '芬兰', 'code': 'FI'},
'Uzbekistan': {'name': 'Uzbekistan', 'latitude': 41.377491, 'longitude': 64.585262, 'chineseName': '乌兹别克斯坦', 'code': 'UZ'},
'Czech Rep.': {'chineseName': '', 'code': 'CZ', 'name': 'Czech Rep.'},
'Central African Rep.': {'chineseName': '', 'code': 'CF', 'name': 'Central African Rep.'},
'Oman': {'name': 'Oman', 'latitude': 21.512583, 'longitude': 55.923255, 'chineseName': '阿曼', 'code': 'OM'},
'Hungary': {'name': 'Hungary', 'latitude': 47.162494, 'longitude': 19.503304, 'chineseName': '匈牙利', 'code': 'HU'},
'Togo': {'name': 'Togo', 'latitude': 8.619543, 'longitude': 0.824782, 'chineseName': '多哥', 'code': 'TG'},
'Vietnam': {'name': 'Vietnam', 'latitude': 14.058324, 'longitude': 108.277199, 'chineseName': '越南', 'code': 'VN'},
'Belgium': {'name': 'Belgium', 'latitude': 50.503887, 'longitude': 4.469936, 'chineseName': '比利时', 'code': 'BE'},
'Congo, Rep.': {'chineseName': '', 'code': 'CG', 'name': 'Congo, Rep.'},
'Pakistan': {'name': 'Pakistan', 'latitude': 30.375321, 'longitude': 69.34511599999999, 'chineseName': '巴基斯坦', 'code': 'PK'},
'Kazakhstan': {'name': 'Kazakhstan', 'latitude': 48.019573, 'longitude': 66.923684, 'chineseName': '哈萨克斯坦', 'code': 'KZ'},
'Cambodia': {'name': 'Cambodia', 'latitude': 12.565679, 'longitude': 104.990963, 'chineseName': '柬埔寨', 'code': 'KH'},
'Puerto Rico': {'name': 'Puerto Rico', 'latitude': 18.220833, 'longitude': -66.590149, 'chineseName': '波多黎各', 'code': 'PR'},
'China': {'name': 'China', 'latitude': 35.86166, 'longitude': 104.195397, 'chineseName': '中国', 'code': 'CN'},
'Guatemala': {'name': 'Guatemala', 'latitude': 15.783471, 'longitude': -90.23075899999999, 'chineseName': '危地马拉', 'code': 'GT'},
'Portugal': {'name': 'Portugal', 'latitude': 39.39987199999999, 'longitude': -8.224454, 'chineseName': '葡萄牙', 'code': 'PT'},
'Gabon': {'name': 'Gabon', 'latitude': -0.803689, 'longitude': 11.609444, 'chineseName': '加蓬', 'code': 'GA'},
'Honduras': {'name': 'Honduras', 'latitude': 15.199999, 'longitude': -86.241905, 'chineseName': '洪都拉斯', 'code': 'HN'},
'Austria': {'name': 'Austria', 'latitude': 47.516231, 'longitude': 14.550072, 'chineseName': '奥地利', 'code': 'AT'},
'Guinea': {'name': 'Guinea', 'latitude': 9.945587, 'longitude': -9.696645, 'chineseName': '几内亚', 'code': 'GN'},
'Uganda': {'name': 'Uganda', 'latitude': 1.373333, 'longitude': 32.290275, 'chineseName': '乌干达', 'code': 'UG'},
'Slovak Republic': {'chineseName': '', 'code': 'SK', 'name': 'Slovak Republic'},
'Canada': {'name': 'Canada', 'latitude': 56.130366, 'longitude': -106.346771, 'chineseName': '加拿大', 'code': 'CA'},
'Montenegro': {'name': 'Montenegro', 'latitude': 42.708678, 'longitude': 19.37439, 'chineseName': '黑山', 'code': 'ME'},
'Peru': {'name': 'Peru', 'latitude': -9.189967, 'longitude': -75.015152, 'chineseName': '秘鲁', 'code': 'PE'},
'Germany': {'name': 'Germany', 'latitude': 51.165691, 'longitude': 10.451526, 'chineseName': '德国', 'code': 'DE'},
'Gambia': {'name': 'Gambia', 'latitude': 13.443182, 'longitude': -15.310139, 'chineseName': '冈比亚', 'code': 'GM'},
'Singapore': {'chineseName': '', 'code': 'SG', 'name': 'Singapore'},
'Ireland': {'name': 'Ireland', 'latitude': 53.41291, 'longitude': -8.24389, 'chineseName': '爱尔兰', 'code': 'IE'},
'Mauritania': {'name': 'Mauritania', 'latitude': 21.00789, 'longitude': -10.940835, 'chineseName': '毛里塔尼亚', 'code': 'MR'},
'Zambia': {'name': 'Zambia', 'latitude': -13.133897, 'longitude': 27.849332, 'chineseName': '赞比亚', 'code': 'ZM'},
'India': {'name': 'India', 'latitude': 20.593684, 'longitude': 78.96288, 'chineseName': '印度', 'code': 'IN'},
'Philippines': {'name': 'Philippines', 'latitude': 12.879721, 'longitude': 121.774017, 'chineseName': '菲律宾', 'code': 'PH'},
'Russia': {'name': 'Russia', 'latitude': 61.52401, 'longitude': 105.318756, 'chineseName': '俄罗斯', 'code': 'RU'},
'Senegal': {'name': 'Senegal', 'latitude': 14.497401, 'longitude': -14.452362, 'chineseName': '塞内加尔', 'code': 'SN'},
'Argentina': {'name': 'Argentina', 'latitude': -38.416097, 'longitude': -63.61667199999999, 'chineseName': '阿根廷', 'code': 'AR'},
'Brazil': {'name': 'Brazil', 'latitude': -14.235004, 'longitude': -51.92528, 'chineseName': '巴西', 'code': 'BR'},
'Namibia': {'name': 'Namibia', 'latitude': -22.95764, 'longitude': 18.49041, 'chineseName': '纳米比亚', 'code': 'NA'},
'Lebanon': {'name': 'Lebanon', 'latitude': 33.854721, 'longitude': 35.862285, 'chineseName': '黎巴嫩', 'code': 'LB'},
'Thailand': {'name': 'Thailand', 'latitude': 15.870032, 'longitude': 100.992541, 'chineseName': '泰国', 'code': 'TH'},
'Malaysia': {'name': 'Malaysia', 'latitude': 4.210484, 'longitude': 101.975766, 'chineseName': '马来西亚', 'code': 'MY'},
'USA': {'name': 'USA','chineseName': '美国','latitude':38, 'longitude':-97, 'code': 'US' },
'Burundi': {'name': 'Burundi', 'latitude': -3.373056, 'longitude': 29.918886, 'chineseName': '布隆迪', 'code': 'BI'},
'Venezuela': {'name': 'Venezuela', 'latitude': 6.42375, 'longitude': -66.58973, 'chineseName': '委内瑞拉', 'code': 'VE'},
'Moldova': {'name': 'Moldova', 'latitude': 47.411631, 'longitude': 28.369885, 'chineseName': '摩尔多瓦', 'code': 'MD'},
'Lithuania': {'name': 'Lithuania', 'latitude': 55.169438, 'longitude': 23.881275, 'chineseName': '立陶宛', 'code': 'LT'},
'Bahrain': {'chineseName': '', 'code': 'BH', 'name': 'Bahrain'},
'Fiji': {'name': 'Fiji', 'latitude': -17.713371, 'longitude': 178.065032, 'chineseName': '斐', 'code': 'FJ'},
'Switzerland': {'name': 'Switzerland', 'latitude': 46.818188, 'longitude': 8.227511999999999, 'chineseName': '瑞士', 'code': 'CH'},
'Iran': {'name': 'Iran', 'latitude': 32.427908, 'longitude': 53.688046, 'chineseName': '伊朗', 'code': 'IR'},
'Kyrgyzstan': {'name': 'Kyrgyzstan', 'latitude': 41.20438, 'longitude': 74.766098, 'chineseName': '吉尔吉斯斯坦', 'code': 'KG'},
'Hong Kong': {'chineseName': '香港','latitude':22.25, 'longitude':114.1667, 'code': 'HK', 'name': 'Hong Kong'},
'Denmark': {'name': 'Denmark', 'latitude': 56.26392, 'longitude': 9.501785, 'chineseName': '丹麦', 'code': 'DK'},
'Panama': {'name': 'Panama', 'latitude': 8.537981, 'longitude': -80.782127, 'chineseName': '巴拿马', 'code': 'PA'},
'Myanmar': {'name': 'Myanmar', 'latitude': 21.913965, 'longitude': 95.956223, 'chineseName': '缅甸', 'code': 'MM'},
'United Kingdom': {'name': 'United Kingdom', 'latitude': 55.378051, 'longitude': -3.435973, 'chineseName': '英国', 'code': 'GB'},
'Tanzania': {'chineseName': '', 'code': 'TZ', 'name': 'Tanzania'},
'Libya': {'name': 'Libya', 'latitude': 26.3351, 'longitude': 17.228331, 'chineseName': '利比亚', 'code': 'LY'},
'Cuba': {'name': 'Cuba', 'latitude': 21.521757, 'longitude': -77.781167, 'chineseName': '古巴', 'code': 'CU'},
'Eritrea': {'name': 'Eritrea', 'latitude': 15.179384, 'longitude': 39.782334, 'chineseName': '厄立特里亚', 'code': 'ER'},
'Bolivia': {'name': 'Bolivia', 'latitude': -16.290154, 'longitude': -63.58865299999999, 'chineseName': '玻利维亚', 'code': 'BO'},
'Suriname': {'name': 'Suriname', 'latitude': 3.919305, 'longitude': -56.027783, 'chineseName': '苏里南', 'code': 'SR'},
'Luxembourg': {'name': 'Luxembourg', 'latitude': 49.815273, 'longitude': 6.129582999999999, 'chineseName': '卢森堡', 'code': 'LU'},
'New Zealand': {'name': 'New Zealand', 'latitude': -40.900557, 'longitude': 174.885971, 'chineseName': '新西兰', 'code': 'NZ'},
'Kuwait': {'name': 'Kuwait', 'latitude': 29.31166, 'longitude': 47.481766, 'chineseName': '科威特', 'code': 'KW'},
'Bosnia and Herzegovina': {'name': 'Bosnia and Herzegovina', 'latitude': 43.915886, 'longitude': 17.679076, 'chineseName': '波斯尼亚和黑塞哥维那', 'code': 'BA'},
'Lesotho': {'name': 'Lesotho', 'latitude': -29.609988, 'longitude': 28.233608, 'chineseName': '莱索托', 'code': 'LS'},
'Zimbabwe': {'name': 'Zimbabwe', 'latitude': -19.015438, 'longitude': 29.154857, 'chineseName': '津巴布韦', 'code': 'ZW'},
'Haiti': {'name': 'Haiti', 'latitude': 18.971187, 'longitude': -72.285215, 'chineseName': '海地', 'code': 'HT'},
'Armenia': {'name': 'Armenia', 'latitude': 40.069099, 'longitude': 45.038189, 'chineseName': '亚美尼亚', 'code': 'AM'},
'Bangladesh': {'name': 'Bangladesh', 'latitude': 23.684994, 'longitude': 90.356331, 'chineseName': '孟加拉国', 'code': 'BD'},
'Spain': {'name': 'Spain', 'latitude': 40.46366700000001, 'longitude': -3.74922, 'chineseName': '西班牙', 'code': 'ES'},
'Serbia': {'chineseName': '', 'code': 'RS', 'name': 'Serbia'},
'Qatar': {'name': 'Qatar', 'latitude': 25.354826, 'longitude': 51.183884, 'chineseName': '卡塔尔', 'code': 'QA'},
'Uruguay': {'name': 'Uruguay', 'latitude': -32.522779, 'longitude': -55.765835, 'chineseName': '乌拉圭', 'code': 'UY'},
'Guinea-Bissau': {'chineseName': '', 'code': 'GW', 'name': 'Guinea-Bissau'},
'Congo, Dem. Rep.': {'chineseName': '', 'code': 'CD', 'name': 'Congo, Dem. Rep.'},
'Belarus': {'name': 'Belarus', 'latitude': 53.709807, 'longitude': 27.953389, 'chineseName': '白俄罗斯', 'code': 'BY'},
'Laos': {'name': 'Laos', 'latitude': 19.85627, 'longitude': 102.495496, 'chineseName': '老挝', 'code': 'LA'},
'Israel': {'name': 'Israel', 'latitude': 31.046051, 'longitude': 34.851612, 'chineseName': '以色列', 'code': 'IL'},
'Nepal': {'name': 'Nepal', 'latitude': 28.394857, 'longitude': 84.12400799999999, 'chineseName': '尼泊尔', 'code': 'NP'},
'Romania': {'name': 'Romania', 'latitude': 45.943161, 'longitude': 24.96676, 'chineseName': '罗马尼亚', 'code': 'RO'},
'West Bank and Gaza': {'chineseName': '', 'code': 'PS', 'name': 'West Bank and Gaza'},

'Belize': {'chineseName': '伯利兹','latitude': 17, 'longitude': -88, 'code': 'Be', 'name': 'Belize'},
'Barbados': {'chineseName': '巴巴多斯','latitude': 13, 'longitude': -59, 'code': 'Bar', 'name': 'Barbados'},
'Bahamas': {'chineseName': '巴哈马','latitude': 25, 'longitude': -77, 'code': 'Bah', 'name': 'Bahamas'},
'Aruba': {'chineseName': '阿鲁巴','latitude': 12, 'longitude': -70, 'code': 'Ar', 'name': 'Aruba'},
'Antigua': {'chineseName': '安提瓜和巴布达','latitude': 17, 'longitude': -61, 'code': 'An', 'name': 'Antigua'},
'Andorra': {'chineseName': '安道尔','latitude': 42, 'longitude': 1, 'code': 'An', 'name': 'Andorra'},
'Bermuda': {'chineseName': '百慕大','latitude': 32, 'longitude': -64, 'code': 'Be', 'name': 'Bermuda'},
'British Virgin Islands': {'chineseName': '英属维尔京群岛','latitude': 18, 'longitude': -64, 'code': 'Bvi', 'name': 'British Virgin Islands'},
'Cayman Islands': {'chineseName': '开曼群岛','latitude': 19, 'longitude': -81, 'code': 'CI', 'name': 'Cayman Islands'},
'Central African Republic': {'chineseName': '中非共和国','latitude': 4, 'longitude': 18, 'code': 'CAR', 'name': 'Central African Republic'},
'Congo': {'chineseName': '刚果','latitude': -4, 'longitude': 15, 'code': 'CAR', 'name': 'Congo'},
'Czech Republic': {'chineseName': '捷克共和国','latitude': 50, 'longitude': 14, 'code': 'Cre', 'name': 'Czech Republic'},
'DR Congo': {'chineseName': '刚果(金)','latitude': -4, 'longitude': 15, 'code': 'Cre', 'name': 'DR Congo'},
'Dominican Republic': {'chineseName': '多米尼加共和国','latitude': 18, 'longitude': -69, 'code': 'Cre', 'name': 'Dominican Republic'},
'French Polynesia': {'chineseName': '法属波利尼西亚','latitude': -17, 'longitude': -149, 'code': 'Cre', 'name': 'French Polynesia'},
'Greenland': {'chineseName': '格陵兰','latitude': 64, 'longitude': -51, 'code': 'Cre', 'name': 'Greenland'},
'Liechtenstein': {'chineseName': '列支敦士登','latitude': 47, 'longitude': 9, 'code': 'Cre', 'name': 'Liechtenstein'},
'Macao SAR': {'chineseName': '澳门','latitude': 22, 'longitude': 113, 'code': 'Cre', 'name': 'Macao SAR'},
'Maldives': {'chineseName': '马尔代','latitude': 4, 'longitude': 73, 'code': 'Cre', 'name': 'Maldives'},
'Malta': {'chineseName': '马耳他','latitude': 35, 'longitude': 14, 'code': 'Cre', 'name': 'Malta'},
'Monaco': {'chineseName': '摩纳哥','latitude': 43, 'longitude': 7, 'code': 'Cre', 'name': 'Monaco'},
'Netherlands Antilles': {'chineseName': '荷属安的列斯','latitude': 12, 'longitude': -69, 'code': 'Cre', 'name': 'Netherlands Antilles'},
'New Caledonia': {'chineseName': '新喀里多尼亚','latitude': -22, 'longitude': 166, 'code': 'Cre', 'name': 'New Caledonia'},
'Gaza Strip': {'chineseName': '加沙地带','latitude': 31, 'longitude': 34, 'code': 'Cre', 'name': 'Gaza Strip'},
'Samoa': {'chineseName': '萨摩亚','latitude': -13, 'longitude': -171, 'code': 'Cre', 'name': 'Samoa'},
'San Marino': {'chineseName': '圣马力诺','latitude': 43, 'longitude': 12, 'code': 'Cre', 'name': 'San Marino'},
'Sao Tome and Principe': {'chineseName': '圣多美和普林西比','latitude': 0, 'longitude': 6, 'code': 'Cre', 'name': 'Sao Tome and Principe'},
'Seychelles': {'chineseName': '塞舌尔','latitude': 4, 'longitude': 55, 'code': 'Cre', 'name': 'Seychelles'},
'Slovakia': {'chineseName': '斯洛伐克','latitude': 45, 'longitude': 17, 'code': 'Cre', 'name': 'Slovakia'},
'South Sudan': {'chineseName': '南苏丹','latitude': 12, 'longitude': 30, 'code': 'Cre', 'name': 'South Sudan'},
'TFYR Macedonia': {'chineseName': '马其顿','latitude': 42, 'longitude': 21, 'code': 'Cre', 'name': 'TFYR Macedonia'},
'Former USSR': {'chineseName': '前苏联','latitude': 53, 'longitude': 27, 'code': 'Cre', 'name': 'Former USSR'},
'UAE': {'chineseName': '阿联酋','latitude': 24, 'longitude': 54, 'code': 'Cre', 'name': 'UAE'},
'UK': {'chineseName': '英国','latitude': 51, 'longitude': 0, 'code': 'Cre', 'name': 'UK'},
'Vanuatu': {'chineseName': '瓦努阿图','latitude': -17, 'longitude': 168, 'code': 'Cre', 'name': 'Vanuatu'},
'Viet Nam': {'chineseName': '越南','latitude': 21, 'longitude': 105, 'code': 'Cre', 'name': 'Viet Nam'},
'Yemen': {'chineseName': '也门','latitude': 15, 'longitude': 50, 'code': 'Cre', 'name': 'Yemen'},

'Mali': {'name': 'Mali', 'latitude': 17.570692, 'longitude': -3.996166, 'chineseName': '马里', 'code': 'ML'}}

//中国
var CNData = {
        "name":"China",                    //出口国
        "chineseName":"中国",
        "type":"export",              //import
        "sum":153.75,                      //进口或出口总和,不能为负数
        "sort":1,                       //排序
        "data":[
             {"name":"USA",   "chineseName":"美国",   "sort":1,   "value":29.19,"sum":25},
             {"name":"Hong Kong",   "chineseName":"香港",   "sort":2,   "value":23.37,"sum":32},
             {"name":"Japan",   "chineseName":"日本",   "sort":3,   "value":19.03,"sum":23},
             {"name":"South Korea",   "chineseName":"韩国",   "sort":4,   "value":9.85,"sum":44},
             {"name":"Germany",   "chineseName":"德国",   "sort":5,   "value":8.76,"sum":33}
        ]
    };
//美国
var USAData = {
    "name": "USA",                    //出口国
    "chineseName": "美国",
    "type": "output",              //input是进口
    "sum": 118.7,                      //进口或出口总和,不能为负数
    "sort": 2,                       //排序
    "data": [
        {"name": "Canada", "chineseName": "加拿大", "sort": 1, "value": 21.45,"sum":25},
        {"name": "Mexico", "chineseName": "墨西哥", "sort": 2, "value": 15.50,"sum":34},
        {"name": "Japan", "chineseName": "日本", "sort": 3, "value": 12.33,"sum":44},
        {"name": "China", "chineseName": "中国", "sort": 4, "value": 10.34,"sum":12},
        {"name": "South Korea", "chineseName": "韩国", "sort": 5, "value": 5.76,"sum":33}
    ]
};
//德国
var DEData = [

];

var planePath = 'path://M1705.64,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
var planePath2 = '';
var planePath3 = 'path://M150 50 L130 130 L170 130  Z';  //箭头
planePath3=planePath;
var convertData = function(item){
    var res = [];
    for (var i = 0; i < item.data.length; i++) {
        var dataItem = item.data[i];
        var fromCoord = [countrytInfo[item["name"]]["longitude"],countrytInfo[item["name"]]["latitude"]];
        var toCoord = [countrytInfo[dataItem["name"]]["longitude"],countrytInfo[dataItem["name"]]["latitude"]];
        if (fromCoord && toCoord) {
            res.push({
                fromName: item["name"],
                toName: dataItem["name"],
                coords: [fromCoord, toCoord],
                value:dataItem.value,
                label :{
                    normal:{
                        show:true,
                        position :'middle',
                        formatter:'{c}',
                        textStyle :{
                            formatter :dataItem.value/10
                        }

                    }

                }
            });
        }
    }
    return res;
}

//额外设置线宽
var convertData2 = function (item) {
    var res = [];
    for (var i = 0; i < item.data.length; i++) {
        var dataItem = item.data[i];
        var fromCoord = [countrytInfo[item["name"]]["longitude"],countrytInfo[item["name"]]["latitude"]];
        var toCoord = [countrytInfo[dataItem["name"]]["longitude"],countrytInfo[dataItem["name"]]["latitude"]];
        if (fromCoord && toCoord) {
            res.push({
                fromName: item["name"],
                toName: dataItem["name"],
                coords: [fromCoord, toCoord],
                value:dataItem.value,
                label :{
                    normal:{
                        show:true,
                        position :'middle',
                        formatter:'{c}',
                        textStyle :{
                            formatter :dataItem.value/10
                        }
                    }
                },
                //symbolSize :dataItem.value*1.1, //箭头大小
                symbol: planePath3,
                symbolSize :15, //箭头大小
                lineStyle:{
                    normal:{
                        width: dataItem.value/5,
                        opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                        curveness: 0.4
                    }
                }
            });
        }
    }
    return res;
};

function randomValue() {
    return Math.round(Math.random()*20);
}


var color = ['#a6c84c',
    '#ffa022',
    '#46bee9'];
var series = [];
[['China', CNData], ['USA', USAData]].forEach(function (item, i) {
    series.push({
        //移动的亮点
        name: item[0] + ' Top5',
        type: 'lines',
        zlevel: 1,  //线图所有图形的 zlevel 值。
        effect: {               //线特效的配置
            show: true,
            period: 6,              //特效动画的时间,单位为 s。
            trailLength: 0.7,       //特效尾迹的长度。取从 0 到 1 的值,数值越大尾迹越长。
            color: '#fff',
            symbolSize: 3          //特效标记的大小,可以设置成诸如 10 这样单一的数字,也可以用数组分开表示高和宽,例如 [20, 10] 表示标记宽为20,高为10。
        },
        lineStyle: {            //对 线 的各种设置 ：颜色,形状,曲度
            normal: {
                color: color[i],
                width: 0,           //线宽
                curveness: 0.4  //边的曲度,支持从 0 到 1 的值,值越大曲度越大。0代表直线,1代表圆
            }
        },
        data: convertData(item[1])
    },
    {
        //  线  +  飞机
        name: item[0] + ' Top5',
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: planePath,  //  飞机
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                color: color[i],
                width: 5,           //线宽与数值有关
                opacity: 0.6,    // 图形透明度。支持从 0 到 1 的数字,为 0 时不绘制该图形。
                curveness: 0.4
            }
        },
        data: convertData2(item[1])
    },
    {
        //国家名字
        name: item[0] + ' Top5',
        type: 'effectScatter',              //带有涟漪特效动画的散点（气泡）图
        coordinateSystem: 'geo',            //该系列使用的坐标系,可选： cartesian2d二维的直角坐标系   polar极坐标系  geo地理坐标系
        zlevel: 2,
        rippleEffect: {                     //涟漪特效相关配置
            brushType: 'stroke'             //波纹的绘制方式   可选 'stroke' 和 'fill'
        },
        label: {                        //图形上的文本标签,可用于说明图形的一些数据信息,
            normal: {
                show: true,
                position: 'right',      //标签的位置。

                formatter: '{b}'           //标签内容格式器,支持字符串模板和回调函数两种形式,字符串模板与回调函数返回的字符串均支持用 \n 换行。
                                            //模板变量有 {a}、{b}、{c},分别表示系列名,数据名,数据值。
            }
        },
        symbolSize: function (val) {            //标记的大小,可以设置成诸如 10 这样单一的数字,也可以用数组分开表示宽和高
            return val[2] ;
        },
        itemStyle: {
            normal: {
                color: color[i]
            }
        },

        data:item[1].data.map(function(dataItem){       //？todo
            return {
                name:dataItem.name+":"+dataItem.chineseName+" "+dataItem.sum,
                value:[
                    countrytInfo[dataItem.name].longitude,
                    countrytInfo[dataItem.name].latitude,
                    dataItem.value
                ]
            }
        })
    }




    );
});

option = {
    backgroundColor: '#404a59',
    title : {
        text: '世界各国进出口',
        subtext: '单位：'+"千亿美元",
        left: 'center',
        textStyle : {
            color: '#fff'
        }
    },
    tooltip : {  //提示框组件。  数据项图形触发,主要在散点图,饼图等无类目轴的图表中使用。
        trigger: 'item',


    },
    legend: {       //图例组件。图例组件展现了不同系列的标记(symbol),颜色和名字。可以通过点击图例控制哪些系列不显示。
        selected:{
            'China Top5':false,
            'USA Top5':false,
        },
        orient: 'vertical',//horizontal
        //top: 'bottom',
        top: 'middle',

        left: 'right',
        data:['China Top5', 'USA Top5'],
        textStyle: {
            color: '#fff'
        },

        selectedMode: 'multiple' //single    false  multiple
    },
geo: {
        map: 'world',//china
        label: {
        //normal: {
        //        show: true
         //   },
            emphasis: {
                show: true
            }
        },
        roam: true,         //是否开启鼠标缩放和平移漫游
        itemStyle: {
            normal: {
                areaColor: '#323c48',       //地图区域的颜色。
                borderColor: '#404a59'  //fff  404a59   描边颜色
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }

    },

    series: series
};;
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}