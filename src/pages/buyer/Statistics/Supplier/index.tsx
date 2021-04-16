import React, {useState} from 'react';
import styles from './index.module.scss';
import { Select, DatePicker} from 'antd';
import Bar from './components/MyBar';

const {Option} = Select;

const suppliers = [{id: 1, name: '供应商1'},{id: 2, name: '供应商2'},{id: 3, name: '供应商3'}];
const orderStatisic = [
    {
        id: 1,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 2,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 3,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 4,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 5,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 6,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 7,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 8,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 9,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 10,
        supplier: '供应商一号',
        orderNum: 1000,
        percent: '70%'
    }
]
export default function Supplier() {
    const [supplier, setSupplier] = useState('');
    const [month, setMonth] = useState('');
    const onTimeChange = (date, dateString) => {
        console.log(dateString)
        setMonth(dateString)
    }
    const onSeleceChange = (val) => {
        console.log(val);
        setSupplier(val)
    }
    return(
        <div className={styles.supplier}>
            <div className={styles.left}>
                <div className={styles.top}>
                    <h4 className={styles.title} style={{borderBottom: '1px solid #E5E5EA', paddingBottom: 40}}>交易额排名</h4>
                    <div className={styles.form}>
                        <DatePicker style={{width: 150}} onChange={onTimeChange} picker="month" />
                    </div>
                </div>
                <div className={styles.bottom}>
                    <h4 className={styles.title}>供应商评价指标分析</h4>
                    <div className={styles.form}>
                        <Select onChange={onSeleceChange} style={{width: 150}} placeholder="请选择供应商">
                            {
                                suppliers.map(item => {
                                    return <Option value={item.name} key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <h4 className={styles.title} style={{borderBottom: '1px solid #E5E5EA',paddingBottom: 40}}>订单数排名统计</h4>
                <div>
                    {
                        orderStatisic.map(item => {
                            return <Bar barData={item}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
