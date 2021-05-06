import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';
import { Menu, Dropdown } from 'antd';
import { Modal, Form, Radio, message, Input, Select} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import service from '@/service/service';
const { Option } = Select;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 19 },
};

export default function(props) {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<{username, roleId, userId}>({username: '',roleId: 0, userId: 0});


    const getUserinfo = () => {
        const userId = Number(sessionStorage.getItem('userId'));
        service.getUserInfo({userId: userId}).then(res => {
            setUserInfo(res);
        })
    }

    useEffect(() => {
        getUserinfo();
    },[])
    const menu = (
        <Menu>
            <Menu.Item onClick={() => {setVisible(true)}}>编辑资料</Menu.Item>
            <Menu.Item>退出登录</Menu.Item>
        </Menu>
    )
    const handleOk = () => {
        form.validateFields().then(values => {
            values.userId = userInfo.userId;
            service.updateUser(values).then(res => {
                if(res.code === 200) {
                    message.info('修改成功');
                    getUserinfo();
                    setVisible(false);
                } else {
                    message.info('修改失败，请稍后重试！');
                }
            })
        })
    }
    return (
        <div className={styles.header}>
            <Dropdown overlay={menu}>
                <div className={styles.user}>
                    <span className={styles.avator}></span>
                    <div><a>{userInfo.username}</a> <DownOutlined /></div>
                </div>
            </Dropdown>
            <Modal title="添加员工" visible={visible}
                onOk={handleOk}
                onCancel={() => {
                    setVisible(false)
                }}
                okText="确认" cancelText="取消">
                    <Form initialValues={userInfo} form={form} {...layout}>
                        <Form.Item name="username" label="姓名" rules={[{required: true, message: '请输入姓名'}]}>
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{required: true, message: '请输入密码'}]}>
                            <Input placeholder="请输入密码" />
                        </Form.Item>
                        <Form.Item name="sex" label="性别" rules={[{required: true}]}>
                            <Radio.Group>
                                <Radio value={0}>男</Radio>
                                <Radio value={1}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="roleId" label="角色" rules={[{required: true, message: '选择角色'}]}>
                            <Select disabled={userInfo.roleId !== 1}>
                                <Option value={1}>系统管理员</Option>
                                <Option value={3}>部门管理员</Option>
                                <Option value={2}>采购员</Option>
                                <Option value={4}>库存管理员</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="nickname" label="昵称">
                            <Input placeholder="请输入昵称" />
                        </Form.Item>
                    </Form>
                </Modal>
        </div>
    )
}