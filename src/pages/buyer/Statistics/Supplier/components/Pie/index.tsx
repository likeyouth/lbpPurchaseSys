import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function Pie(props) {
    // data : [{name: "供应商", value: 50}, {name: "供应商", value: 50}]
    const {data} = props;
    // const data2 = {name: '', value:100 - data1.value}
    let barColor = data.value > 80 ? 'rgb(143, 188, 135)' :  data.value > 60 ? 'rgb(90, 177, 239)' : 'rgb(210, 93, 73)'
    var option = {
        color:[barColor, '#e6f1ff'],
        title: {
            text: data.title,
            show: true,
            textStyle: {
                color: '#555',
                fontSize: 14,
                fontWeight: 'normal'
            },
            top: '30%',
            left: 'center'
        },
        series: [
            {
                name:'pie',
                type: 'pie',
                // center: ["50%", "15%"],
                // radius: ["42%", "50%"],
                center: ["50%", "15%"],
                radius: ["42%", "50%"],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                label: { //  饼图图形上的文本标签
                    normal: { // normal 是图形在默认状态下的样式
                        show: true,
                        position: 'center',
                        color: barColor,
                        fontSize: 15,
                        formatter: '{d}%' // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[{
                        value: data.value,
                        name: data.name,
                        label: {
                            normal: {
                                show: true
                            }
                        }
                    },
                    {
                        value: 100-data.value,
                        name: 'data2',
                        label: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            }
        ]
    };
    return (
        <ReactEcharts option={option} />
    )
}
    /*const drawPie = function(data1, data2) {
        // 暗色部分圆弧
        data2.itemStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                color: "#4293fe",
                borderColor: "#4293FE",
                borderWidth: 4,
                opacity: 0.1
            },
        }
        let barColor = data1.value > 80 ? 'rgb(143, 188, 135)' :  data1.value > 60 ? 'rgb(90, 177, 239)' : 'rgb(210, 93, 73)'
        let title = {
            text: data1.title,
            show: true,
            textStyle: {
                color: '#555',
                fontSize: 14,
                fontWeight: 'normal'
            },
            top: '30%',
            left: 'center'
        };
        let center = ["50%", "15%"];
        let radius = ["85%", "87%"];
        data1.itemStyle = {
            normal: {
                label: {
                    show: true,
                    formatter: '{d}%'
                },
                labelLine: {
                    show: false
                },
                color: "#444",
                borderColor: barColor,
                borderWidth: 4
            },
        }
        let option = {
            title: title,
            series: [{
                center: center,
                radius: radius,
                clockWise: false,
                hoverAnimation: false,
                type: "pie",
                // startAngle: -45,
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        color: barColor,
                        formatter: '{d}%'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                // itemStyle: {
                //     normal: {
                //         label: {
                //             show: true,
                //             textStyle: {
                //                 fontSize: 16,
                //                 color: barColor,
                //             },
                //             position: "center",
                //             formatter: function (data) {
                //                 if(data.name) {
                //                     return data.name + "%"
                //                 }
                //             }
                //         },
                //         labelLine: {
                //             show: false
                //         },
                //         // color: "#4293FE",
                //         // borderColor: "#4293FE",
                //         // borderWidth: 3
                //     },
                // },
                data: [data2, data1]
            }]
        };
        return option;
    }*/