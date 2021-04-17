import React, { useState, useEffect } from 'react';
import { Link } from 'ice';
import styles from './index.module.scss';
import { Menu } from 'antd';
import {
    ShopOutlined,
    UsergroupAddOutlined,
    PieChartOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

export default function (props) {

    const menuSelections = (role) => {
        switch (role) {
            case '库存管理员': return [{ key: 'lbpgl', text: '劳保品管理', icon: <UnorderedListOutlined />, path: '/storage/goodsManage'}, { key: 'ddgl', text: '订单管理', icon: <ShopOutlined />, path: '/storage/orderForm'}];
            case '采购员': return [{ key: 'cggl', text: '采购管理', icon: <ShopOutlined />, children: [{ key: 'cgsp', text: '采购审批', path: '/buyer/approvalList'}, { key: 'cgjh', text: '采购计划', path: '/buyer/plane'}, { key: 'cgdd', text: '采购订单', path: '/buyer/orderManage'}] }, {key: 'tjfx', text: '统计分析', icon: <PieChartOutlined />, children: [{ key: 'ddtj', text: '订单统计', path: '/buyer/orderStatistic'}, { key: 'gystj', text: '供应商统计', path: '/buyer/supplierStatistic' }, { key: 'lbptj', text: '劳保品统计', path: '/buyer/goodsStatistic' }]}, { key: 'gysgl', text: '供应商管理', icon: <UsergroupAddOutlined />, path: '/buyer/supplier'}]
            case '部门管理员': return [{key : 'lbyplb', text: '劳保用品列表', icon: <UnorderedListOutlined />, path: '/department/goods'}, {key : 'cgsqlb', text: '采购申请列表', icon: <ShopOutlined />, path: '/department/apply'}]
            case '系统管理员': return [{key : 'yggl', text: '员工管理', icon: <UsergroupAddOutlined/>, path: '/admin/userManage'}, {key : 'ddgl', text: '订单管理', icon: <ShopOutlined />,path: '/admin/orderForm'}]
            default: return []
        }
    }

    const renderMenuItem = (menuItem) => {
        if(menuItem.children) {
            return (
                <SubMenu key={menuItem.key} title={menuItem.text} icon={menuItem.icon}>
                    {menuItem.children.map(renderMenuItem)}
                </SubMenu>
            )
        } else {
            return(
                <Menu.Item key={menuItem.key} icon={menuItem.icon}><Link to={{pathname: menuItem.path}}>{menuItem.text}</Link></Menu.Item>
            )
        }
    }

    const renderMenu = (role) => {
        const menuText = menuSelections(role)
        return menuText.map(renderMenuItem)
    }

        return (
            <div className={styles.menu}>
                <Menu defaultOpenKeys={['cggl', 'tjfx']} mode="inline">
                    {renderMenu(props.role)}
                </Menu>
            </div>
        )
    }