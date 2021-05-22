import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import {DatePicker, Empty} from 'antd';
import Chart from '../components/EchartsBar';
import Pie from '../Supplier/components/Pie';
import service from '@/service/service';
import moment from 'moment'

export default function GoodsStatistic() {
    const [pieData, setPieData] = useState([]);
    const [barData, setBarData] = useState([]);

    const onChange = (date, dateString) => {
        getLbpNum({year: dateString});
    }

    const getLbpNum = (query?) => {
        query = query || {year: new Date().getFullYear()};
        service.getLbpNum(query).then(res => {
            setPieData(res.pieData);
            setBarData(res.barData);
        })
    }

    useEffect(() => {
        getLbpNum();
    }, [])

    return(
        <div className={styles.goodsStatistic}>
            <h4 className={styles.title}>劳保品申请数量统计</h4>
            <DatePicker defaultValue={moment(new Date().toString())} style={{width: 250}} onChange={onChange} picker="year" />
            {
                pieData.length ?
                <>
                    <div className={styles.pieContainer}>
                        {
                            pieData.map((item: {name}) => {
                                return <div key={item.name} className={styles.pieArea}><Pie from="goods" data={item}/></div>
                            })
                        }
                    </div>
                    <div className={styles.chart}>
                        <Chart data={barData} from="goods"/>
                    </div>
                    <h4 className={styles.chartTitle}>各劳保品申请数量统计图</h4>
                </>:
                <Empty style={{marginTop:'10%'}}/>
            }
        </div>
    )
}
