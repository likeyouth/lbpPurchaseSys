import React from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import {useHistory} from 'ice';

export default function () {
    const history = useHistory()
    const onFinish = (values: any) => {
        const res = service.login(values);
        res.then(({roleId, userId, token}) => {
            message.info('登陆成功');
            sessionStorage.setItem('roleId', roleId)
            sessionStorage.setItem('userId', userId)
            sessionStorage.setItem('token', token)
            selectRole(roleId)
        })
    }

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
                message.error('角色不存在！');
                break;
        }
    }

    const onFinishFailed = (err: any) => {
        console.log(err)
    }
    return (
        <div className={styles.login}>
            <div className={styles.content}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <h4>劳保品采购系统</h4>
                    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item name="username" rules={[{required: true, message: '请输入用户名！'}]}>
                            <Input prefix={<UserOutlined style={{color: 'rgb(140, 140, 140)'}}/>} placeholder="请输入用户名"/>
                        </Form.Item>
                        <Form.Item name="password" rules={[{required: true, message: '请输入密码！'}]}>
                            <Input.Password prefix={<UnlockOutlined style={{color: 'rgb(140, 140, 140)'}}/>} placeholder="请输入密码"/>
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit">登录</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
