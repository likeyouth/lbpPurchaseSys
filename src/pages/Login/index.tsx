import React from 'react';
import styles from './index.module.scss';
import { Form, Input, Button} from 'antd';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';

export default function () {
    const onFinish = (values: any) => {
        console.log(values)
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
                        <Form.Item name="username" rules={[{required: true, message: '请输入用户名！'}]}>
                            <Button block type="primary" htmlType="submit">登录</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
