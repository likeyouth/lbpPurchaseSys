import React from 'react';
import styles from './index.module.scss';
import { Tabs } from 'antd';
import AppliedList from './AppliedList';
import ApprovalList from './ApprovalList';

const { TabPane } = Tabs;

export default function OrderForm () {

    const onTabChange = (key) => {console.log(key)}
    return(
        <div className={styles.orderForm}>
            <h4 className={styles.title}>订单管理</h4>
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
                <TabPane tab="已审批" key="1">
                    <ApprovalList />
                </TabPane>
                <TabPane tab="未审批" key="2">
                    <AppliedList />
                </TabPane>
            </Tabs>
        </div>
    )
}