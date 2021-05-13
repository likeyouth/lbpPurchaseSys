import React, {useState} from 'react';
import styles from './index.module.scss';
import {DatePicker} from 'antd';
import Chart from '../components/EchartsBar';
import Pie from '../Supplier/components/Pie';

const monthData = [{name: "一劳保品", value: 100}, {name: "二劳保品", value: 200}, {name: "三劳保品", value: 300},{name: "四劳保品", value: 400},{name: "五劳保品", value: 500},
{name: "六劳保品", value: 100}, {name: "七劳保品", value: 200}, {name: "八劳保品", value: 300},{name: "九劳保品", value: 400},{name: "十劳保品", value: 500}, {name: "十一劳保品", value: 600},{name: "十二劳保品", value: 700}]
const pieData = [{title: '防护手套', name: "hgl", value: 39.2},{title: '防护鞋', name: "price", value: 88},{title: '头盔', name: "tk", value: 70},{title: '安全带', name: "aqd", value: 80},{title: '其他', name: "else", value: 80},
{title: '防护手套', name: "hgl1", value: 39.2},{title: '防护鞋', name: "price1", value: 88},{title: '头盔', name: "t1k", value: 70},{title: '安全带', name: "aq1d", value: 80},{title: '其他', name: "el1se", value: 80}]
export default function GoodsStatistic() {

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    }

    return(
        <div className={styles.goodsStatistic}>
            <h4 className={styles.title}>劳保品购买数量统计</h4>
            <DatePicker style={{width: 250}} onChange={onChange} picker="year" />
            <div className={styles.pieContainer}>
                {
                    pieData.map(item => {
                        return <div key={item.name} className={styles.pieArea}><Pie data={item}/></div>
                    })
                }
            </div>
            <div className={styles.chart}>
                <Chart data={monthData} />
            </div>
            <h4 className={styles.chartTitle}>各劳保品购买数量统计图</h4>
        </div>
    )
}
