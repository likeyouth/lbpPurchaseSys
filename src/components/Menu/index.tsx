import React, { useState } from 'react';
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
    // const [collapsed, setCollapsed] = useState<boolean>(false)
    // const toggleCollapsed = () => {
    //     setCollapsed(!collapsed)
    // }

    const menuSelections = (role) => {
        switch (role) {
            case '库存管理员': return [{ key: 'lbpgl', text: '劳保品管理', icon: 'UnorderedListOutlined'}, { key: 'ddgl', text: '订单管理', icon: 'ShopOutlined'}];
            case '采购员': return [{ key: 'cggl', text: '采购管理', icon: 'ShopOutlined', children: [{ key: 'cgsp', text: '采购审批' }, { key: 'cgjh', text: '采购计划' }, { key: 'cgdd', text: '采购订单' }] }, { key: 'gysgl', text: '供应商管理', icon: 'UsergroupAddOutlined'}, {key: 'tjfx', text: '统计分析', icon: 'PieChartOutlined'}]
            case '部门管理员': return [{key : 'lbyplb', text: '劳保用品列表', icon: 'UnorderedListOutlined'}, {key : 'cgsqlb', text: '采购申请列表', icon: 'ShopOutlined'}]
            case '系统管理员': return [{key : 'yggl', text: '员工管理', icon: 'UsergroupAddOutlined'}, {key : 'ddgl', text: '订单管理', icon: 'ShopOutlined'}]
            default: return []
        }
    }

    const renderMenuItem = (menuItem) => {
        if(menuItem.children) {
            return (
                <SubMenu key={menuItem.key} icon={`<${menuItem.icon} />`} title={menuItem.text}>
                    {menuItem.children.map(renderMenuItem)}
                </SubMenu>
            )
        } else {
            return(
                <Menu.Item key={menuItem.key} icon={`<${menuItem.icon} />`}>{menuItem.text}</Menu.Item>
            )
        }
    }

    const renderMenu = (role) => {
        return renderMenu(menuSelections(role))
    }

        return (
            <div className={styles.menu}>
                <Menu theme="dark" mode="inline">
                    {renderMenu(props.role)}
                </Menu>
            </div>
        )
    }