import React from 'react';
import styles from './index.module.scss';
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function () {
    const onFinish = (values: any) => {
        console.log(values)
    }

    const onFinsishFailed = (err: any) => {
        console.log(err)
    }
    return (
        <div className={styles.login}>
            <div className={styles.content}>
                <h1>劳保品采购系统</h1>
                <Form
                name="basic"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinsishFailed}
                >
                    <Form.Item name="username" rules = {[{ required: true, message: '请输入用户名!' }]}><Input size="large" placeholder="请输入用户名" prefix={<UserOutlined />} /></Form.Item>
                    <Form.Item name="password" rules = {[{ required: true, message: '请输入密码!' }]}><Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined />} /></Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">登录</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
