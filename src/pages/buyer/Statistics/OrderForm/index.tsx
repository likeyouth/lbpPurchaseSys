import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import classnames from '@/utils/classnames';
import { DatePicker, Radio} from 'antd';
import Chart from '../components/EchartsBar';
import moment from 'moment';
import service from '@/service/service';

const year = new Date().getFullYear();
export default function OrderStatistic() {
    const [selectValue, setSelectValue] = useState('month');
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);

    const handleChange = (e) => {
        setSelectValue(e.target.value)
    }
    const onDateChange = (date, dateString) => {
        getStatisticByMonth({year: dateString});
    }

    const getStatisticByMonth = (query?) => {
        query = query || {year: year};
        service.getStatisticByMonth(query).then(res => {
            setMonthData(res);
        })
    }

    const getStatisticByYear = () => {
        service.getStatisticByYear().then(res => {
            setYearData(res);
        })
    }

    useEffect(() => {
        getStatisticByMonth();
        getStatisticByYear();
    }, [])
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
