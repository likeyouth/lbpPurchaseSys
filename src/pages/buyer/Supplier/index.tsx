import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import {Table, Input, Button, Modal, Form, message } from 'antd';
const {Search, TextArea} = Input;
const {confirm} = Modal;

const layout = {
    labelCol: { span: 5},
    wrapperCol: { span: 19 },
};

export default function Supplier () {
    const [total, setTotal] = useState<number>(100);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
        supplierName: ''
    });

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%',
            key: 'order'
        },
        {
            title: '供应商名称',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '联系人',
            dataIndex: 'contact',
            key: 'contact',
            width: '8%'
        },
        {
            title: '公司地址',
            dataIndex: 'address',
            key: 'address',
            width: '13%',
            ellipsis: true,
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '邮件',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
            ellipsis: true,
        },
        {
            title: '开户银行',
            dataIndex: 'bank',
            key: 'bank',
            width: '7%',
            ellipsis: true,
        },
        {
            title: '银行账户',
            dataIndex: 'bankNumber',
            key: 'bankNumber',
            width: '10%',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: '10%',
            ellipsis: true,
            render: (remark) => (
                !remark ? '未填写' : remark
            )
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '12%',
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

    const getSuppliers = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        service.getSuppliers(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(()=>{
        getSuppliers();
    },[])

    const handleClick = (index, row) => {
        if(index === 1) {
            confirm({
                content: '确认删除吗？',
                onOk: () => {
                    service.deleteSupplier({supplierId: row.supplierId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功！');
                            getSuppliers(query.current);
                        }
                    })
                }
            })
        } else {
            form.setFieldsValue(row)
            setVisible(true);
            setIsEdit(true);
        }
    }
    const showSizeChanger = (current, pageSize) => {
        query.current.pageIndex = 1;
        query.current.pageSize = pageSize;
        getSuppliers({pageIndex: 1, pageSize: pageSize, supplierName: query.current.supplierName});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getSuppliers({pageIndex: page, pageSize: query.current.pageSize, supplierName: query.current.supplierName});
    }

    const handleSearch = (val) => {
        query.current.supplierName = val;
        query.current.pageIndex = 1;
        getSuppliers({pageIndex: 1, pageSize: query.current.pageSize, supplierName: val});
    }

    const handleOk = () => {
        form.validateFields().then(values => {
            console.log(values);
            if(isEdit) {
                service.updateSupplier(values).then(res => {
                    if(res.code === 200) {
                        message.info('更新成功！');
                        getSuppliers(query.current);
                        form.setFieldsValue({supplierName: '', address: '', phone: '', email: '', bank: '', remark: '', bankNumber: '', contact: ''})
                        setVisible(false)
                    }
                })
            } else {
                service.addSupplier(values).then(res => {
                    if(res.code === 200) {
                        message.info('添加成功！');
                        getSuppliers({pageIndex: 1, pageSize: query.current.pageSize, supplierName: query.current.supplierName});
                        form.setFieldsValue({supplierName: '', address: '', phone: '', email: '', bank: '', remark: '', bankNumber: '', contact: ''})
                        setVisible(false)
                    }
                })
            }
        }).catch(err => {console.log(err)});
    }
    return(
        <div className={styles.supplier}>
            <h4 className={styles.title}>供应商管理</h4>
            <div className={styles.formArea}>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入供应商名称" onSearch={handleSearch}></Search>
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setIsEdit(false);}}>添加供应商</Button>
            </div>
            <Table
            size="small"
            bordered
            scroll={{ y: 460 }}
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
            <Modal title="添加供应商" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                form.setFieldsValue({name: '', address: '', phone: '', email: '', account: '', remark: ''})
                setVisible(false)
            }}
            okText="确认" cancelText="取消">
                <Form form={form} {...layout}>
                    <Form.Item name="supplierId" style={{display: 'none'}}>
                        <Input placeholder="请输入供应商名称" />
                    </Form.Item>
                    <Form.Item name="supplierName" label="供应商名称" rules={[{required: true, message: '供应商不为空'}]}>
                        <Input placeholder="请输入供应商名称" />
                    </Form.Item>
                    <Form.Item name="contact" label="联系人" rules={[{required: true, message: '联系人不为空'}]}>
                        <Input placeholder="联系人名称" />
                    </Form.Item>
                    <Form.Item name="address" label="公司地址" rules={[{required: true, message: '地址不为空'}]}>
                        <Input placeholder="公司地址" />
                    </Form.Item>
                    <Form.Item name="phone" label="联系电话" rules={[{required: true, message: '电话不为空'}]}>
                        <Input placeholder="联系电话" />
                    </Form.Item>
                    <Form.Item name="email" label="邮件" rules={[{required: true},{type: 'email'}, {message: '邮件不为空'}]}>
                        <Input placeholder="邮箱" />
                    </Form.Item>
                    <Form.Item name="bank" label="开户银行" rules={[{required: true, message: '银行不为空'}]}>
                        <Input placeholder="银行账户" />
                    </Form.Item>
                    <Form.Item name="bankNumber" label="银行账号" rules={[{required: true, message: '银行账号不为空'}]}>
                        <Input placeholder="银行账户" />
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <TextArea
                        placeholder="备注"
                        autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
