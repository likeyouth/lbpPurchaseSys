import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import classnames from '@/utils/classnames';
import { DatePicker, Radio, Empty} from 'antd';
import Chart from '../components/EchartsBar';
import moment from 'moment';
import service from '@/service/service';

const initialYear = new Date().getFullYear();
export default function OrderStatistic() {
    const [selectValue, setSelectValue] = useState('month');
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const [category, setCategory] = useState([]);
    const [year, setYear] = useState(initialYear);

    const handleChange = (e) => {
        setSelectValue(e.target.value)
    }
    const onDateChange = (date, dateString) => {
        setYear(dateString);
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

    const getCategoryPrice = () => {
        service.getCategoryPrice().then(res => {
            setCategory(res);
        }).catch(err => {
            console.log(err);
        })
    }

    const renderChart = () => {
        if(selectValue === 'month' && monthData.length) {
            return  <Chart data={ monthData } />
        } else if(selectValue === 'year') {
            return <Chart data={ yearData } />
        } else {
            return <Empty style={{marginTop: 20}}/>
        }
    }

    useEffect(() => {
        getStatisticByMonth();
        getStatisticByYear();
        getCategoryPrice();
    }, [])
    return(
        <div className={styles.orderStatistic}>
            <div className={styles.card}>
                {
                    category.map((item: {category, totalPrice, englishName}, index) => {
                        return (
                            <div key={index} className={styles.cardItem}>
                                <div className={classnames(styles.icon, styles[item.englishName])}></div>
                                <div className={styles.text}>
                                    <span className={styles.titleText}>{item.category}</span>
                                    <span className={styles.number}>{item.totalPrice}</span>
                                </div>
                            </div>
                        )
                    })
                }
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
                    {
                        renderChart()
                    }
                </div>
            </div>
        </div>
    )
}
