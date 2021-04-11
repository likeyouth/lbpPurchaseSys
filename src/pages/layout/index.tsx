import React from 'react';
import styles from './index.module.scss';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd';

export default function BasicLayout({children} : {children: React.ReactNode}) {
    return(
        <ConfigProvider locale={zhCN}>
        <div className={styles.layout}>
            <div className={styles.left}>
                <div className={styles.menuTop}>
                    <div className={styles.logo}></div>
                    <h4>劳保品管理系统</h4>
                </div>
                <Menu role='采购员' />
            </div>
            <div className={styles.right}>
                <Header />
                {children}
            </div>
        </div>
        </ConfigProvider>
    )
}