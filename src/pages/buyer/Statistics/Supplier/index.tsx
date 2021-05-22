import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import { Select, DatePicker, Empty} from 'antd';
import MyBar from './components/MyBar';
import EchartsBar from './components/EchartsBar';
import Pie from './components/Pie';
import service from '@/service/service';

const {Option} = Select;

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
const pieData = [{title: '产品合格率', name: "hgl", value: 39.2},{title: '价格', name: "price", value: 88},{title: '到货准时率', name: "dhzsl", value: 70},{title: '服务水平', name: "fwsp", value: 80},{title: '好评率', name: "hpl", value: 77},{title: '好评率', name: "hpl", value: 77},
{title: '产品合格率', name: "hgl", value: 39.2},{title: '价格', name: "price", value: 88},{title: '到货准时率', name: "dhzsl", value: 70},{title: '服务水平', name: "fwsp", value: 80}]
export default function Supplier() {
    const [suppliers, setSupplier] = useState([]);
    const [suppliersData, setSupplierData] = useState([]);
    const [percentData, setPercentData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const onTimeChange = (date, dateString) => {
        getStatisticeBySupplier({year: dateString});
    }
    const onSeleceChange = (val) => {
        console.log(val);
        setSupplier(val)
    }

    const getSuppliers = () => {
        service.getSuppliers({all : true}).then(res => {
            const suppliers = res.data.map(item => (
                {id: item.supplierId, name: item.supplierName}
            ))
            setSupplier(suppliers);
        }).catch(err => {
            console.log(err);
        })
    }
    const getStatisticeBySupplier = (query?) => {
        query = query || {year: new Date().getFullYear()};
        service.getStatisticBySupplier(query).then(res => {
            setPercentData(res.percent);
            setSupplierData(res.suppliersData);
        }).catch(err => {
            console.log(err);
        })
    }
    const getOrderNum = () => {
        service.getOrderNum().then(res => {
            setOrderData(res);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getSuppliers();
        getStatisticeBySupplier();
        getOrderNum();
    }, [])
    return(
        <div className={styles.supplier}>
            <div className={styles.left}>
                <div className={styles.top}>
                    <h4 className={styles.title} style={{borderBottom: '1px solid #E5E5EA', paddingBottom: 40}}>交易额排名</h4>
                    <div className={styles.form}>
                        <DatePicker style={{width: 150}} onChange={onTimeChange} picker="year" />
                    </div>
                    <div className={styles.echartsBar}>
                        {
                            suppliersData.length ?
                            <EchartsBar percent={percentData} data={suppliersData} /> :
                            <Empty style={{marginTop: 50}}/>
                        }
                    </div>
                </div>
                <div className={styles.bottom}>
                    <h4 className={styles.title}>供应商评价指标分析</h4>
                    <div className={styles.form}>
                        <Select onChange={onSeleceChange} style={{width: 150}} placeholder="请选择供应商">
                            {
                                suppliers.map((item: {id, name}) => {
                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className={styles.pieContainer}>
                        {
                            pieData.map((item,index) => {
                                return <div key={index} className={styles.pieArea}><Pie data={item}/></div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <h4 className={styles.title} style={{borderBottom: '1px solid #E5E5EA',paddingBottom: 40}}>订单数排名统计</h4>
                <div className={styles.list} id="listBox">
                    {
                        orderData.length ?
                        orderData.map((item:{id},index) => {
                            return <MyBar index={index + 1} key={item.id} barData={item}/>
                        }) :
                        <Empty style={{marginTop: '45%'}}/>
                    }
                </div>
            </div>
        </div>
    )
}
