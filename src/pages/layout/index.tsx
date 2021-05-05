import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import service from '@/service/service';
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd';
import { useHistory } from 'ice';

export default function BasicLayout({children} : {children: React.ReactNode}) {
    const [userInfo, setUserInfo] = useState<{username}>({username: ''});
    const roleId:number = Number(sessionStorage.getItem('roleId'))
    const history = useHistory()
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token) {
            history.push('/login')
        }
    }, [])

    const getUserinfo = () => {
        const userId = Number(sessionStorage.getItem('userId'));
        service.getUserInfo({userId: userId}).then(res => {
            setUserInfo(res);
        })
    }

    useEffect(() => {
        getUserinfo();
    },[])

    const selectRole = (roleId) => {
        switch(roleId) {
            case 1:
                history.push('/admin/userManage');
                break;
            case 2:
                history.push('/buyer/approvalList');
                break;
            case 3:
                history.push('/department/goods');
                break;
            case 4:
                history.push('/storage/goodsManage');
                break;
            default:
                break;
        }
    }

    const hasPermission = () => {
        const hash = window.location.hash.slice(1);
        // hash: /
        if(hash === '/') {
            const roleId = Number(sessionStorage.getItem('roleId'));
            selectRole(roleId);
        } else if(hash === '/login') {
            history.push('/login');
        } else {
            const roleId = Number(sessionStorage.getItem('roleId'));
            switch(roleId) {
                case 1:
                    hash.includes('admin') ? history.push(hash) : history.push('/admin/userManage');
                    break;
                case 2:
                    hash.includes('buyer') ? history.push(hash) : history.push('/buyer/approvalList');
                    break;
                case 3:
                    hash.includes('department') ? history.push(hash) : history.push('/department/goods');
                    break;
                case 4:
                    hash.includes('storage') ? history.push(hash) :  history.push('/storage/goodsManage');
                    break;
                default:
                    break;
            }
        }
    }

    window.onhashchange = hasPermission


    return(
        <ConfigProvider locale={zhCN}>
        <div className={styles.layout}>
            <div className={styles.left}>
                <div className={styles.menuTop}>
                    <div className={styles.logo}></div>
                    <h4>劳保品管理系统</h4>
                </div>
                <Menu role={roleId} />
            </div>
            <div className={styles.right}>
                <Header getUserinfo={getUserinfo} userInfo={userInfo} />
                {children}
            </div>
        </div>
        </ConfigProvider>
    )
}