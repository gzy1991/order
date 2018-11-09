var uploadedDataURL = "/static/app/map7/data-1498994055008-rJJ5SUU4W.csv";


var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });


d3.csv(uploadedDataURL, function(error, rawData) {
    if (error) throw error;

    var root = stratify(rawData)
        .sum(function(d) {
            return d.value;
        })
        .sort(function(a, b) {
            return b.value - a.value;
        });
    var maxDepth = 0;
    var seriesData = root.descendants().map(function (node) {
        maxDepth = Math.max(maxDepth, node.depth);
        return [
            node.value,
            node.depth,
            node.id
        ];
    });
    var pieces = [];
    for (var i = 0; i <= maxDepth; i++) {
        pieces.push({value: i, label: 'Level ' + i});
    }

    function renderItem(params, api) {
        var context = params.context;
        if (!context.layout) {

            d3.pack()
                .size([api.getWidth() - 2, api.getHeight() - 2])
                .padding(3)(root);

            context.layout = {};
            root.descendants().forEach(function (node) {
                context.layout[node.id] = {
                    x: node.x,
                    y: node.y,
                    r: node.r,
                    isLeaf: !node.children || !node.children.length
                };
            });
        }

        var nodePath = api.value(2);
        var itemLayout = context.layout[nodePath];

        var nodeName = '';
        var textFont = api.font({
            fontSize: 12,
            fontFamily: 'Arial'
        });

        if (itemLayout.isLeaf && itemLayout.r > 10) {
            nodeName = nodePath.slice(nodePath.lastIndexOf('.') + 1).split(/(?=[A-Z][^A-Z])/g).join('\n');
            nodeName = echarts.format.truncateText(nodeName, itemLayout.r, textFont, '.');
        }

        return {
            type: 'circle',
            shape: {
                cx: itemLayout.x,
                cy: itemLayout.y,
                r: itemLayout.r
            },
            z2: api.value(1) * 2,
            style: api.style({
                text: nodeName,
                textFont: textFont,
                textPosition: 'inside'
            }),
            styleEmphasis: api.style({
                text: nodeName,
                textPosition: 'inside',
                textFont: textFont,
                stroke: 'rgba(0,0,0,0.5)',
                lineWidth: 3
            })
        };
    }

    var option = {
        xAxis: {
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false},
            splitLine: {show: false}
        },
        yAxis: {
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false},
            splitLine: {show: false}
        },
        tooltip: {},
        visualMap: {
            // show: false,
            type: 'piecewise',
            bottom: 40,
            pieces: pieces,
            dimension: 1,
            inRange: {
                color: ['#006edd', '#e0ffff']
            }
        },
        series: {
            type: 'custom',
            renderItem: renderItem,
            encode: {
                tooltip: 0,
                itemName: 2
            },
            data: seriesData
        }
    };

    myChart.setOption(option);

});