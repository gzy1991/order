/*
*   Created by gzy on 2019年6月24日
* */

/*地图全局数据*/
var datas; 		 		//  容器，存储了表格的全部数据，
var selectedRow;   		//  table中选中的那一行 的行数据
var seriesData = [];         //  容器，存储 数据
var unit = '';  //单位

/*      echarts数据       */
var dom = document.getElementById("dataEcharts");
var myChart = echarts.init(dom,"red");
var option = null,
    baseColors = [
        //'rgb(194,53,49)',
        '#c23531',
        '#2f4554',
        '#61a0a8',
        '#d48265',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#c4ccd3',
        "#32cd32",
        "#6495ed",
        "#40e0d0",
        "#7b68ee",
    ],
    colors = [
        /* "#C23531",
         "#ff7f50",
         "#87cefa",
         "#da70d6",
         "#32cd32",
         "#6495ed",
         "#ff69b4",
         "#ba55d3",
         "#cd5c5c",
         "#ffa500",
         "#40e0d0",
         "#1e90ff",
         "#ff6347",
         "#7b68ee",
         "#00fa9a",
         "#ffd700",
         "#6699FF",
         "#ff6666",
         "#3cb371",
         "#b8860b",
         "#30e0e0"*/
    ],
    curColors = [];

/**
 * js中hex16进制颜色转rgb(rgb)
 * @param hex 例如:"#23ff45"
 * @returns {string}
 */
function hexToRgb(hex) {
    return "rgb(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + ")";
}

/*将RGB颜色值转换为16进制颜色值，主要是将 R、G、B 值分别转换为对应的十六进制值，填入 #RRGGBB 中。
* 输入：rgb(176,114,98)
* 输出：#B07262
* */
function colorRGBtoHex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

/* 通过基础色，生成相近的颜色
*  baseColor : 例如:"#23ff45"
*  index:同类型内，第几个   ，index>0
* */
function gengerateColorByBaseColor(baseColor, index) {
    var rgbColor = hexToRgb(baseColor);
    var rgb = rgbColor.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    if(r>=g && r>=b ){          /*修改 g和b*/
        g= g+15*index <=255 ? g+15*index    :   g-15*(index-  parseInt((255-g)/15 ));
        b= b+15*index <=255 ? b+15*index    :   b-15*(index-  parseInt((255-g)/15 ));
    }else if(g>=r && g>=b){     /*修改 r和b*/
        r= r+15*index <=255 ? r+15*index    :   r-15*(index-  parseInt((255-g)/15 ));
        b= b+15*index <=255 ? b+15*index    :   b-15*(index-  parseInt((255-g)/15 ));
    }else {                     /*修改 r和g*/
        r= r+15*index <=255 ? r+15*index    :   r-15*(index-  parseInt((255-g)/15 ));
        g= g+15*index <=255 ? g+15*index    :   g-15*(index-  parseInt((255-g)/15 ));
    }
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

/*
    根据城市的分类，生成颜色，
    每个类型，是一个色系，
    类型内，第一个是基础色
*/
function generateColors(cityInfos) {
    var cityDivide = {};
    var colorDivide = {}; //存储类型的基础色
    var baseCount = 0;
    var baseColor;  //某类型的基础色
    cityInfos.forEach(function (item, i) {
        var cityName = item[0];
        var cityType = item[1];
        if (cityDivide[cityType] == undefined) { //
            baseColor = baseColors[baseCount]; //本类型的基础色
            colorDivide[cityType] = baseColor; //存储本类型的基础色
            cityDivide[cityType] = [];
            cityDivide[cityType].push(cityName);
            baseCount++;
            colors.push(baseColor);  //  同类型的第一个用 基础色
        } else {
            baseColor = colorDivide[cityType];
            cityDivide[cityType].push(cityName);
            var newColor = gengerateColorByBaseColor(baseColor,cityDivide[cityType].length);
            colors.push(newColor);  //同类型，其余的，用生成的颜色
        }
    })
}

/*  初始化echarts */
var initEchart = function (row) {
    console.log("初始化 echarts ! ")
    if (myChart && myChart.dispose) {
        myChart.dispose();
    }
    dom = document.getElementById("dataEcharts");
    myChart = echarts.init(dom,"red");
    var nodesList = [];
    $.each(row.cityList, function (i, item) {
        nodesList.push({name: item})
    })
    generateColors(row.cityInfo);
    option = {
        timeline: {
            data: row.timeline,
            label: {
                formatter: function (s) {
                    return s.slice(0, 4);
                },
                textStyle: {
                    fontSize: 15,
                    fontFamily: "Times New Roman"//字体
                }
            },
            autoPlay: true,
            playInterval: 2000
        },
        options: [
            {
                color: colors,
                title: {
                    // text:'2002 测试数据1',
                    text: row.timeline[0] + "年" + row.title,
                    // subtext:'单位:百万',
                    subtext: '单位:' + row.unit,
                    textStyle: {
                        fontFamily: "Times New Roman"//字体
                    },
                    subtextStyle: {
                        fontFamily: "Times New Roman"//字体
                    },
                    x: '50',
                    y: '50'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.indicator2) { // is edge
                            return params.name + ":" + params.value.weight;
                        } else {// is node
                            return params.name
                        }
                    }
                },
                legend: {
                    x: '50',
                    y: '150',
                    orient: 'vertical',
                    // data:['city1','city2','city3','city4'],
                    data: row.cityList,
                    textStyle: {
                        color: "auto",
                        fontSize: 15,
                        fontFamily: "Times New Roman"//字体
                    }
                },
                series: [
                    {
                        type: 'chord',
                        sortSub: 'ascending',
                        top: 20,
                        symbolSize: 10,
                        nodes: nodesList,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontFamily: "Times New Roman",//字体
                                        //color:"red",
                                        fontSize: 20
                                    }
                                }
                            }
                        },
                        matrix: row.matrixList[0]
                    }
                ]
            },
        ]
    };
    for (var i = 1; i < row.matrixList.length; i++) {
        option.options.push({
            title: {
                text: row.timeline[i] + "年" + row.title
            },
            series: [
                {
                    matrix: row.matrixList[i]
                }
            ]
        })
    }
    myChart.setOption(option);
    myChart.setTheme("red");
}

/*初始化页面框架*/
initFrame(
    "MAP8_DIR",
    "mainContainer",
    "tableContainer",
    "operationBtnGroup",
    "addBtn",
    "delBtn",
    "refBtn",
    "backgroundSwitch",
    "hideBtn",
    "dataTable",
    "h-handler",
    "echartsContainer",
    "dataEcharts",
    myChart.id,
    initEchart
);

/*初始化页面数据  左侧表格数据*/
initPageData("/initMap8");


