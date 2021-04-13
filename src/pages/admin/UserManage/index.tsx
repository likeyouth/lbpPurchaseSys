import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Input, Button, Modal, Form, Radio, Select } from 'antd';

const {Search} = Input;
const {confirm} = Modal;
const {Option} = Select;
const { TextArea } = Input;
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 19 },
};

export default function UserManage () {
    const [total, setTotal] = useState<number>(100);
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm()
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '10%'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            // width: '15%'
        },
        {
            title: '性别',
            dataIndex: 'gender'
        },
        {
            title: '工号',
            dataIndex: 'userNo',
            // width: '10%'
        },
        {
            title: '密码',
            dataIndex: 'password',
            // width: '10%'
        },
        {
            title: '角色',
            dataIndex: 'role',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
        {
            title: '创建时间',
            dataIndex: 'time',
        },
        {
            title: '操作',
            dataIndex: 'operate',
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
    const data:any[] = [];
    for(let i=0; i<100; i++) {
        data.push({
            key: i,
            order: i+1,
            name: `员工${i+1}`,
            gender: '女',
            userNo: 192039093+i,
            password: '12345',
            role: '采购员',
            remark: '负责XXX',
            time: '2020-04-12',
            operate: ['编辑', '删除']
        })
    }
    const handleSearch = val => {
        console.log(val)
    }
    const handleClick = (index, row) => {
        if(index === 1) {
            confirm({
                content: '确认删除该员工吗？',
                onOk() {
                    console.log('删除了')
                }
            })
        } else {
            form.setFieldsValue(row)
            setVisible(true)
        }
    }
    const showSizeChanger = (current, pageSize) => {
        console.log(current, pageSize)
        query.current.pageSize = pageSize
        query.current.pageIndex = 1
    }

    const onPageChange = (page) => {
        console.log(page)
        query.current.pageIndex = page
    }

    const handleOk = () => {
        form.setFieldsValue({name: '', gender: '', remark: '', role: '', password: '', userNo: ''})
        setVisible(false)
    }

    const handleAdd = () => {
        setVisible(true)
    }
    return(
        <div className={styles.userManage}>
            <h4 className={styles.title}>员工管理</h4>
            <div className={styles.form}>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入员工名称" enterButton onSearch={handleSearch} />
                <Button onClick={() => {handleAdd()}} type="primary">新增员工</Button>
            </div>
            <Table
                size="small"
                bordered
                scroll={{ y: 400 }}
                dataSource={data}
                columns={columns}
                pagination={{
                    total: total,
                    showQuickJumper: true,
                    onChange: onPageChange,
                    onShowSizeChange: showSizeChanger,
                    showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
                }}></Table>
                <Modal title="添加员工" visible={visible}
                onOk={handleOk}
                onCancel={() => {
                    form.setFieldsValue({name: '', gender: '', remark: '', role: '', password: '', userNo: ''})
                    setVisible(false)
                }}
                okText="确认" cancelText="取消">
                    <Form form={form} {...layout}>
                        <Form.Item name="name" label="姓名" rules={[{required: true, message: '请输入姓名'}]}>
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item name="userNo" label="工号" rules={[{required: true, message: '请输入工号'}]}>
                            <Input placeholder="请输入工号" />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{required: true, message: '请输入密码'}]}>
                            <Input placeholder="请输入密码" />
                        </Form.Item>
                        <Form.Item name="gender" label="性别" rules={[{required: true, message: '请输入姓名'}]}>
                            <Radio.Group>
                                <Radio value='男'>男</Radio>
                                <Radio value='女'>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="role" label="角色" rules={[{required: true, message: '请输入密码'}]}>
                            <Select>
                                <Option value="0">系统管理员</Option>
                                <Option value="1">部门管理员</Option>
                                <Option value="3">采购员</Option>
                                <Option value="4">库存管理员</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="remark" label="备注">
                            <TextArea
                            placeholder="请输入申请原因"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            onChange={(value) => console.log(value)} />
                        </Form.Item>
                    </Form>
                </Modal>
        </div>
    )
}
