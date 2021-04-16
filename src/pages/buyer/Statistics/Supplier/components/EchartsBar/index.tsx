import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function EchartsBar(props) {
    // data : [{name: "供应商", value: 50}, {name: "供应商", value: 50}]
    const { data, percent } = props;
    var option = {
        grid: {
            left: 20,
            top: 30,
            bottom: 50,
            right: 30,
            containLabel: true
        },
        tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                shadowStyle: {
                    color: 'rgba(65,145,250,0.10)'
                }
            },
            textStyle: {
                color: "#fff",
                fontSize: 12
            },
            backgroundColor: 'rgba(16,29,106,0.85)',
            borderColor: '#19C1FD',
            borderWidth: 1,
            extraCssText: 'border-radius:0;padding:8px;',
            // formatter: function formatter(data) {
            //     // return data[0].seriesName + "&nbsp;&nbsp;" + data[0].value + "万元</br>同比&nbsp;&nbsp;" + data[1].value + "%";
            //     return '<div class="tooltip" style="height:0.4rem"><div class="item" style="height:50%"><p><span style="background-color: #4292FD;"></span><span>' + data[0].seriesName + '</span></p><p>' + data[0].value + '万元</p></div><div class="item" style="height:50%"><p><span style="background-color: #F6DB96;"></span><span>同比</span></p><p>' + data[1].value + '%</p></div></div>';
            // }
        },
        color: ["#F6DB96", "#2EC7C9"],
        legend: {
            data: [{name: '销售额', icon: 'circle', textStyle: {color: '#444'}},{name: '占比', textStyle: {color: '#444'}}],
            top: 0,
            right: 'center',
            textStyle: {
                fontSize: 12
            },
            itemWidth: 8,
            itemHeight: 8
        },
        xAxis: {
            data: data.map(item => item.name),
            axisLine: {
                show: true, //隐藏X轴轴线
                lineStyle: {
                    color: 'rgba(87,160,255,0.50)',
                    width: 1
                }
            },
            axisTick: {
                show: false //隐藏X轴刻度
            },
            axisLabel: {
                show: true,
                interval: 0,
                textStyle: {
                    color: "#444", //X轴文字颜色
                    fontSize: 12
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: ["rgba(250,250,250,0.1)", "rgba(250,250,250,0)"]
                }
            }
        },
        yAxis: [{
            type: "value",
            name: "元",
            nameTextStyle: {
                color: "#444",
                fontSize: 12
            },
            splitLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    type: 'dashed',
                    color: 'rgba(87,160,255,0.30)'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#444",
                    fontSize: 12
                }
            }

        }, {
            type: "value",
            position: 'right',
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false,
                formatter: "{value} %",
                textStyle: {
                    color: "#444",
                    fontSize: 12
                }
            }

        }],
        series: [{
            name: "销售额",
            type: "bar",
            barWidth: 15,
            itemStyle: {
                normal: {
                    color: '#5AB1EF',
                    "barBorderRadius": [50, 50, 50, 50],
                }
            },
            data: data
        }, {
            name: "占比",
            type: "line",
            yAxisIndex: 1,
            smooth: false,
            showAllSymbol: true, //显示所有图形。
            symbol: "none",
            lineStyle: {
                color: '#2EC7C9',
                width: 1
            },
            itemStyle: {
                normal: {
                    color: '#2EC7C9'
                }
            },
            data: percent
        }]
    };
    return (
        <ReactEcharts option={option} />
    )
}
