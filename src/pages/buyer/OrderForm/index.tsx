import React, {useState} from 'react';
import styles from './index.module.scss';
import { Tabs } from 'antd';
import WillApplyLIst from './WillApplyList';
import AppliedList from './AppliedList';
import ApprovalList from'./ApprovaledLIst';
import PassedList from './PassedList';
import service from '@/service/service';

const { TabPane } = Tabs;

export default function OrderForm () {
    const [isReget, setIsReget] = useState(false);

    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>订单管理</h4>
            <Tabs defaultActiveKey="0">
                <TabPane tab="待申请" key="0">
                    <WillApplyLIst setIsReget={setIsReget} />
                </TabPane>
                <TabPane tab="已申请" key="1">
                    <AppliedList isReget={isReget} setIsReget={setIsReget} />
                </TabPane>
                <TabPane tab="已审批" key="2">
                    <ApprovalList setIsReget={setIsReget} />
                </TabPane>
                <TabPane tab="已付款" key="4">
                    <PassedList status={4}/>
                </TabPane>
                <TabPane tab="已到货" key="5">
                    <PassedList status={5}/>
                </TabPane>
            </Tabs>
        </div>
    )
}