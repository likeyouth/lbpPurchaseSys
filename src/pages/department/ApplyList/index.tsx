import React, {useState} from 'react';
import styles from './index.module.scss';
import WillApply from './WillApply';
import Applied from './Applied';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default function ApplyList() {
    const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
    return(
        <div className={styles.applyList}>
            <h4 className={styles.title}>申请列表</h4>
            <Tabs defaultActiveKey="1">
                <TabPane tab="已申请列表" key="1">
                    <Applied shouldUpdate={shouldUpdate} setShouldUpdate = {setShouldUpdate}/>
                </TabPane>
                <TabPane tab="待申请列表" key="2">
                    <WillApply setShouldUpdate = {setShouldUpdate}/>
                </TabPane>
            </Tabs>
        </div>
    )
}