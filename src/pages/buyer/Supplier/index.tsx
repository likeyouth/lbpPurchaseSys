import React, {useState, useRef} from 'react';
import styles from './index.module.scss';
import {Table, Input, Button, Modal, Form } from 'antd';
const {Search, TextArea} = Input;
const {confirm} = Modal;

const layout = {
    labelCol: { span: 5},
    wrapperCol: { span: 19 },
};

export default function Supplier () {
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
            width: '5%'
        },
        {
            title: '供应商名称',
            dataIndex: 'name',
            // width: '15%'
        },
        {
            title: '公司地址',
            dataIndex: 'address'
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            // width: '10%'
        },
        {
            title: '邮件',
            dataIndex: 'email',
            // width: '10%'
        },
        {
            title: '银行账户',
            dataIndex: 'account',
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
            render: (op, row) => (
                <div>
                    {op.map((item,index)=>{
                        return(
                            <Button key={index} type="link" onClick={() => {handleClick(index, row)}} danger={index === 1}>{item}</Button>
                        )
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
            name: `供应商${i+1}`,
            address: 'xxxxxxx',
            phone: '10086',
            email: '12345@qq.com',
            account: '1234567',
            remark: '安全类劳保品供应商',
            time: '2020-04-12',
            operate: ['编辑', '删除']
        })
    }

    const handleClick = (index, row) => {
        if(index === 1) {
            confirm({
                content: '确认删除吗？',
                onOk: () => {console.log('删除了')}
            })
        } else {
            form.setFieldsValue(row)
            setVisible(true)
            console.log(row)
        }
    }
    const handleAdd = () => {
        setVisible(true)
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
        form.setFieldsValue({name: '', address: '', phone: '', email: '', account: '', remark: ''})
        setVisible(false)
    }
    return(
        <div className={styles.supplier}>
            <h4 className={styles.title}>供应商管理</h4>
            <div className={styles.form}>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入供应商名称" onSearch={(val) => {console.log(val)}}></Search>
                <Button type="primary" onClick={() => {handleAdd()}}>添加供应商</Button>
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
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
            <Modal title="添加供应商" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                form.setFieldsValue({name: '', address: '', phone: '', email: '', account: '', remark: ''})
                setVisible(false)
            }}
            okText="确认" cancelText="取消">
                <Form form={form} {...layout}>
                    <Form.Item name="name" label="供应商名称" rules={[{required: true, message: '必填'}]}>
                        <Input placeholder="请输入供应商名称" />
                    </Form.Item>
                    <Form.Item name="address" label="公司地址" rules={[{required: true, message: '必填'}]}>
                        <Input placeholder="公司地址" />
                    </Form.Item>
                    <Form.Item name="phone" label="联系电话" rules={[{required: true, message: '必填'}]}>
                        <Input placeholder="联系电话" />
                    </Form.Item>
                    <Form.Item name="email" label="邮件" rules={[{required: true},{type: 'email'}]}>
                        <Input placeholder="邮箱" />
                    </Form.Item>
                    <Form.Item name="account" label="银行账户" rules={[{required: true, message: '必填'}]}>
                        <Input placeholder="银行账户" />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <TextArea
                        placeholder="备注"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        onChange={(value) => console.log(value)} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
