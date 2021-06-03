import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import { Select, DatePicker, Empty} from 'antd';
import MyBar from './components/MyBar';
import EchartsBar from './components/EchartsBar';
import Pie from './components/Pie';
import service from '@/service/service';

const {Option} = Select;

export default function Supplier() {
    const [suppliers, setSupplier] = useState([]);
    const [suppliersData, setSupplierData] = useState([]);
    const [percentData, setPercentData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [pieData, setPieData] = useState<{title, name, value}[] >([]);

    const onTimeChange = (date, dateString) => {
        getStatisticeBySupplier({year: dateString});
    }

    // 换算成百分制
    const getValue = (val:string) => {
        return Math.round(parseFloat(val) / 10 * 100);
    }
    const getValue1 = (val:string) => {
        const value = parseFloat(val);
        if(value <=0) {
            return 100;
        } else {
            const percent = Math.round(100 - value);
            const result = percent > 0 ? percent : 0;
            return result;
        }
    }
    const onSeleceChange = (val) => {
        service.getIndexScore({supplierId: val}).then(res => {
            const data: {title, name, value}[] = [];
            const weight = res[0];
            for(let key in weight) {
                switch(key) {
                    case 'after_service':
                        data.push({title: '售后服务', name: key, value: getValue(weight[key])});
                        break;
                    case 'pre_service':
                        data.push({title: '售前服务', name: key, value: getValue(weight[key])});
                        break;
                    case 'avg_price':
                        data.push({title: '平均价格', name: key, value: getValue1(weight[key])});
                        break;
                    case 'credit':
                        data.push({title: '信誉', name: key, value: getValue(weight[key])});
                        break;
                    case 'lowest_price':
                        data.push({title: '最低价格', name: key, value: getValue1(weight[key])});
                        break;
                    case 'ord':
                        data.push({title: '准确率', name: key, value: getValue(weight[key])});
                        break;
                    case 'otd':
                        data.push({title: '准时率', name: key, value: getValue(weight[key])});
                        break;
                    case 'pass_rate':
                        data.push({title: '合格率', name: key, value: getValue(weight[key])});
                        break;
                    case 'quality': data.push({title: '质量等级', name: key, value: getValue(weight[key])}); break;
                    case 'supplier_level': data.push({title: '供应能力', name: key, value: getValue(weight[key])}); break;
                }
            }
            setPieData(data);
        })
    }

    const getSuppliers = () => {
        service.getESuppliers().then(res => {
            setSupplier(res);
            onSeleceChange(1);
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
                        <Select defaultValue={1} onChange={onSeleceChange} style={{width: 150}} placeholder="请选择供应商">
                            {
                                suppliers.map((item: {supplierId, supplierName}) => {
                                    return <Option value={item.supplierId} key={item.supplierId}>{item.supplierName}</Option>
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
