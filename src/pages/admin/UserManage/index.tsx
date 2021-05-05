import React, {useState, useRef,useMemo, useEffect} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import {Table, Input, Button, Modal, Form, Radio, Select, message } from 'antd';

const {Search} = Input;
const {confirm} = Modal;
const {Option} = Select;
const { TextArea } = Input;
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 19 },
};

export default function UserManage () {
    const [total, setTotal] = useState<number>(0);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
        username: ''
    });
    const initialValue = useMemo(() => ({username: '', sex: 0, description: '', roleId: 1, password: 123456, dept: '', nickname: ''}), [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '6%',
            key: 'order'
        },
        {
            title: '姓名',
            dataIndex: 'username',
            // width: '15%'
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: (sex) => (
                sex === 0? '男' : '女'
            )
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname'
            // width: '10%'
        },
        {
            title: '密码',
            dataIndex: 'password',
            key: 'password'
            // width: '10%'
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            // width: '10%',
            render: (op, row) => (
                <div>
                    {op.map((item, index) => {
                        return <Button key={index} style={{marginLeft: 10}} type="link" size="small" danger={index === 1} onClick={() => {handleClick(index,row)}}>{item}</Button>
                    })}
                </div>
            )
        }
    ]
    const handleSearch = val => {
        query.current.username = val;
        query.current.pageIndex = 1;
        getUser({pageIndex: 1, pageSize: query.current.pageSize, username: val});
    }
    const handleClick = (index, row) => {
        console.log(row);
        if(index === 1) {
            confirm({
                content: '确认删除该员工吗？',
                onOk() {
                    service.deleteUser({userId: row.userId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                            getUser(query.current);
                        } else {
                            message.info('删除失败，请稍后重试！');
                        }
                    })
                }
            })
        } else {
            form.setFieldsValue(row);
            setIsEdit(true);
            setVisible(true);
        }
    }
    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getUser({pageIndex: 1, pageSize: pageSize, username: query.current.username});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page
        getUser({pageIndex: page, pageSize: query.current.pageSize, username: query.current.username});
    }

    const getRole = (roleId) => {
        switch(roleId) {
            case 1: return '系统管理员';
            case 2: return '采购员';
            case 3: return '部门管理员';
            case 4: return '库存管理员';
            default: return '';
        }
    }

    const handleOk = () => {
        form.validateFields().then(values => {
            values.role = getRole(values.roleId);
            if(isEdit) {
                service.updateUser(values).then(res => {
                    if(res.code === 200) {
                        message.info('修改成功');
                        form.setFieldsValue(initialValue);
                        getUser(query.current);
                        setVisible(false);
                    } else {
                        message.info('修改失败，请稍后重试！');
                    }
                })
            } else {
                service.addUser(values).then(res => {
                    if(res.code === 200) {
                        message.info('添加成功');
                        form.setFieldsValue(initialValue);
                        getUser({pageIndex: 1, pageSize: query.current.pageSize});
                        setVisible(false)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getUser = (query?) => {
        query = query || {pageSize: 10, pageIndex: 1};
        service.getUser(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        })
    }

    useEffect(() => {
        getUser();
    }, [])

    return(
        <div className={styles.userManage}>
            <h4 className={styles.title}>员工管理</h4>
            <div className={styles.form}>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入员工名称" enterButton onSearch={handleSearch} />
                <Button onClick={() => {
                    setVisible(true);
                    setIsEdit(false);
                    }} type="primary">新增员工</Button>
            </div>
            <Table
                size="small"
                bordered
                scroll={{ y: 450 }}
                dataSource={data}
                columns={columns}
                pagination={{
                    total: total,
                    showQuickJumper: true,
                    onChange: onPageChange,
                    onShowSizeChange: showSizeChanger,
                    showSizeChanger: true,
                    showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
                }}></Table>
                <Modal title="添加员工" visible={visible}
                onOk={handleOk}
                onCancel={() => {
                    form.setFieldsValue(initialValue);
                    setVisible(false)
                }}
                okText="确认" cancelText="取消">
                    <Form initialValues={initialValue} form={form} {...layout}>
                        <Form.Item name="userId" label="userid" style={{display: 'none'}}>
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item name="username" label="姓名" rules={[{required: true, message: '请输入姓名'}]}>
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{required: true, message: '请输入密码'}]}>
                            <Input placeholder="请输入密码" />
                        </Form.Item>
                        <Form.Item name="dept" label="部门" rules={[{required: true, message: '请输入部门'}]}>
                            <Input placeholder="请输入部门名称" />
                        </Form.Item>
                        <Form.Item name="sex" label="性别" rules={[{required: true}]}>
                            <Radio.Group>
                                <Radio value={0}>男</Radio>
                                <Radio value={1}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="roleId" label="角色" rules={[{required: true, message: '选择角色'}]}>
                            <Select>
                                <Option value={1}>系统管理员</Option>
                                <Option value={3}>部门管理员</Option>
                                <Option value={2}>采购员</Option>
                                <Option value={4}>库存管理员</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="nickname" label="昵称">
                            <Input placeholder="请输入昵称" />
                        </Form.Item>
                        <Form.Item name="description" label="描述">
                            <TextArea
                            placeholder="请输入员工描述"
                            autoSize={{ minRows: 2, maxRows: 6 }} />
                        </Form.Item>
                    </Form>
                </Modal>
        </div>
    )
}
