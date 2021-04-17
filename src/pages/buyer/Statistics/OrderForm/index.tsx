import React, {useState} from 'react';
import styles from './index.module.scss';
import classnames from '@/utils/classnames';
import { DatePicker, Radio} from 'antd';
import Chart from '../components/EchartsBar';
import moment from 'moment';

const monthData = [{name: "一月", value: 100}, {name: "二月", value: 200}, {name: "三月", value: 300},{name: "四月", value: 400},{name: "五月", value: 500},
{name: "六月", value: 100}, {name: "七月", value: 200}, {name: "八月", value: 300},{name: "九月", value: 400},{name: "十月", value: 500}, {name: "十一月", value: 600},{name: "十二月", value: 700}]
const yearData = [{name: "2015", value: 1000}, {name: "2016", value: 2000},{name: "2017", value: 3000},{name: "2018", value: 4000},{name: "2019", value: 5000},{name: "2020", value: 6000},{name: "2021", value: 7000}]
const year = new Date().getFullYear();
export default function OrderStatistic() {
    const [selectValue, setSelectValue] = useState('month');

    const handleChange = (e) => {
        setSelectValue(e.target.value)
    }
    const onDateChange = (date, dateString) => {
        console.log(date,dateString)
    }
    return(
        <div className={styles.orderStatistic}>
            <div className={styles.card}>
                <div className={styles.cardItem}>
                    <div className={classnames(styles.icon, styles.icon1)}></div>
                    <div className={styles.text}>
                        <span className={styles.titleText}>头部护具</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <div className={classnames(styles.icon, styles.icon2)}></div>
                    <div className={styles.text}>
                        <span className={styles.titleText}>呼吸护具</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <div className={classnames(styles.icon, styles.icon3)}></div>
                    <div className={styles.text}>
                        <span className={styles.titleText}>防护服</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <div className={classnames(styles.icon, styles.icon4)}></div>
                    <div className={styles.text}>
                        <span className={styles.titleText}>防护鞋</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <div className={classnames(styles.icon, styles.icon5)}></div>
                    <div className={styles.text}>
                        <span className={styles.titleText}>眼(面)护具</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <div className={classnames(styles.icon, styles.icon6)}></div>
                    <div className={styles.text}>
                        <span className={styles.titleText}>防坠落护具</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
            </div>
            <div className={styles.graph}>
                <h4 className={styles.title}>订单统计</h4>
                <div>
                    <Radio.Group style={{marginRight: 20, marginTop: 10}} onChange={handleChange} defaultValue="month" >
                        <Radio.Button value="month">按月统计</Radio.Button>
                        <Radio.Button value="year">按年统计</Radio.Button>
                    </Radio.Group>
                    {
                        selectValue === 'month' &&  <DatePicker defaultValue={moment(year.toString())} onChange={onDateChange} picker="year" />
                    }
                </div>
                <div className={styles.chart}>
                    <Chart data={selectValue === 'month' ? monthData : yearData} />
                </div>
            </div>
        </div>
    )
}
