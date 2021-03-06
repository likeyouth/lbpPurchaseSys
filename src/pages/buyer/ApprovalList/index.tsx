import React, {useState} from 'react';
import styles from './index.module.scss';
import { Tabs } from 'antd';
import ApprovaledList from './ApprovaledList';
import AppliedList from './AppliedList';

const { TabPane } = Tabs;

export default function ApprovalList () {
    const [isChange, setIsChange] = useState<boolean>(false);

    const onTabChange = (key) => {console.log(key)}
    return(
        <div className={styles.list}>
            <h4 className={styles.title}>采购审批</h4>
            <Tabs defaultActiveKey="1" onChange={onTabChange}>
                <TabPane tab="已审批" key="1">
                    <ApprovaledList setIsChange={setIsChange} isChange={isChange}/>
                </TabPane>
                <TabPane tab="未审批" key="2">
                    <AppliedList setIsChange={setIsChange}/>
                </TabPane>
            </Tabs>
        </div>
    )
}
