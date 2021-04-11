import React from 'react';
import styles from './index.module.scss';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function() {
    const menu = (
        <Menu>
            <Menu.Item>个人中心</Menu.Item>
            <Menu.Item>退出登录</Menu.Item>
        </Menu>
    )
    return (
        <div className={styles.header}>
            <Dropdown overlay={menu}>
                <div className={styles.user}>
                    <span className={styles.avator}></span>
                    <div>用户名 <DownOutlined /></div>
                </div>
            </Dropdown>
        </div>
    )
}