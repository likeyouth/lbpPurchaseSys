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
            劳保品采购管理系统
            <div className={styles.user}>
                <Dropdown overlay={menu}>
                    <a>
                        用户名 <DownOutlined />
                    </a>
                </Dropdown>
            </div>
        </div>
    )
}