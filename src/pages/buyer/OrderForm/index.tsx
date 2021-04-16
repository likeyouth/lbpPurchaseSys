import React from 'react';
import styles from './index.module.scss';
import { Tabs } from 'antd';
import WillApplyLIst from './WillApplyList';
import AppliedList from './AppliedList';
import ApprovalList from'./ApprovaledLIst';
import PassedList from './PassedList';

const { TabPane } = Tabs;

export default function OrderForm () {

    const onTabChange = (key) => {console.log(key)}
    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>订单管理</h4>
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
                <TabPane tab="待申请" key="1">
                    <WillApplyLIst />
                </TabPane>
                <TabPane tab="已申请" key="2">
                    <AppliedList />
                </TabPane>
                <TabPane tab="已审批" key="3">
                    <ApprovalList />
                </TabPane>
                <TabPane tab="已付款" key="4">
                    <PassedList />
                </TabPane>
                <TabPane tab="已到货" key="5">
                    <PassedList />
                </TabPane>
            </Tabs>
        </div>
    )
}