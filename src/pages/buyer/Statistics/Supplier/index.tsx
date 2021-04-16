import React, {useState} from 'react';
import styles from './index.module.scss';
import { Select, DatePicker} from 'antd';
import MyBar from './components/MyBar';
import EchartsBar from './components/EchartsBar';
import Pie from './components/Pie';

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
        supplier: '供应商二号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 3,
        supplier: '供应商三号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 4,
        supplier: '供应商四号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 5,
        supplier: '供应商五号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 6,
        supplier: '供应商六号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 7,
        supplier: '供应商七号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 8,
        supplier: '供应商八号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 9,
        supplier: '供应商十号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 10,
        supplier: '供应商十一号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 11,
        supplier: '供应商八号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 12,
        supplier: '供应商十号',
        orderNum: 1000,
        percent: '70%'
    },
    {
        id: 13,
        supplier: '供应商十一号',
        orderNum: 1000,
        percent: '70%'
    }
]
const suppliersData = [{value: 5000, name: '供应商1'},{value: 4000, name: '供应商2'},{value: 3000, name: '供应商3'},{value: 5000, name: '供应商1'},{value: 4000, name: '供应商2'},{value: 3000, name: '供应商3'},{value: 5000, name: '供应商1'},{value: 4000, name: '供应商2'},{value: 3000, name: '供应商3'}];
const percentData = [{name: '供应商1', value: '40'},{name: '供应商2', value: '30'},{name: '供应商3', value: '20'},{name: '供应商1', value: '40'},{name: '供应商2', value: '30'},{name: '供应商3', value: '20'},{name: '供应商1', value: '40'},{name: '供应商2', value: '30'},{name: '供应商3', value: '20'}];
const pieData = [{title: '产品合格率', name: "hgl", value: 39.2},{title: '价格', name: "price", value: 88},{title: '到货准时率', name: "dhzsl", value: 70},{title: '服务水平', name: "fwsp", value: 80},{title: '好评率', name: "hpl", value: 77},{title: '好评率', name: "hpl", value: 77},
{title: '产品合格率', name: "hgl", value: 39.2},{title: '价格', name: "price", value: 88},{title: '到货准时率', name: "dhzsl", value: 70},{title: '服务水平', name: "fwsp", value: 80}]
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
                    <div className={styles.echartsBar}>
                        <EchartsBar percent={percentData} data={suppliersData} />
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
                    <div className={styles.pieContainer}>
                        {
                            pieData.map(item => {
                                return <div className={styles.pieArea}><Pie data={item}/></div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <h4 className={styles.title} style={{borderBottom: '1px solid #E5E5EA',paddingBottom: 40}}>订单数排名统计</h4>
                <div className={styles.list} id="listBox">
                    {
                        orderStatisic.map(item => {
                            return <MyBar key={item.id} barData={item}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
