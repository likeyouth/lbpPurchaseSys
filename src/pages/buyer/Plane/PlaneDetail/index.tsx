import React, {useState, useRef,useEffect} from 'react';
import styles from './index.module.scss';
import {Table, Button, Modal, Input, Form, message} from 'antd';
import service from '@/service/service';
import {useSearchParams} from 'ice';

const {confirm} = Modal;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function OrderDetail () {
    const [form] = Form.useForm();
    const [total, setTotal] = useState<number>(100)
    const [visible, setVisible] = useState<boolean>(false);
    const [data, setData] = useState([]);
    const {planeId, isOrder, isForm} = useSearchParams();
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
            title: '名称',
            dataIndex: 'lbpName',
            // width: '15%'
        },
        {
            title: '图片',
            dataIndex: 'img',
            align: 'center',
            // width: '20%',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '规格',
            dataIndex: 'standard',
            ellipsis: true
        },
        {
            title: '价格',
            dataIndex: 'price'
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            // width: '10%'
        },
        {
            title: '审批人',
            dataIndex: 'replier',
            // width: '10%'
        },
        {
            title: '申请回复',
            dataIndex: 'replyContent',
            // width: '20%'
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '8%',
            render: (op, row) => (
                <Button type="link" onClick={() => {handleRemove(row)}}>移除</Button>
            )
        }
    ]

    const handleRemove = (row) => {
        confirm({
            content: '确认将该条记录移出采购计划吗',
            onOk: () => {
                service.updateReply({replyId: row.replyId}).then(res => {
                    if(res.code === 200) {
                        message.info('移除成功');
                        getApprovalList(query.current);
                    }
                })
            }
        })
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getApprovalList({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getApprovalList({pageIndex: page, pageSize:query.current.pageSize});
    }

    const handleOk = () => {
        const applierId = Number(sessionStorage.getItem('userId'));
        form.validateFields().then(values => {
            values.planeId = planeId;
            values.supplierId = 2;
            values.applierId = applierId;
            service.addOrder(values).then(res => {
                if(res.code === 200) {
                    setVisible(false);
                    message.info('添加成功，请到采购订单中查看！')
                }
            })
        })
    }

    const getApprovalList = (query?) => {
        query = query || {pageSize: 10, pageIndex:1};
        query.planeId = planeId;
        service.getApprovalList(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        })
    }

    useEffect(() => {
        getApprovalList();
    }, [])

    return(
        <div className={styles.detail}>
            <h4 className={styles.title}>{isForm === 'order' ? '订单详情' : '采购计划详情'}</h4>
            <Button style={{marginBottom: 15, display: isForm==='order' ? 'none' : 'block'}} disabled={ Number(isOrder) === 1 } type="primary" onClick={() => {setVisible(true)}}>生成订单</Button>
            <Table size="small" bordered scroll={{y: 450}}
            // @ts-ignore
            dataSource={data} columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showSizeChanger: true,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
            }}></Table>
            <Modal title="生成订单" visible={visible}
            onOk={handleOk}
            onCancel={() => {setVisible(false)}}>
                <Form form={form} {...layout}>
                    <Form.Item name="orderName" label="订单名称" rules={[{required: true, message: '请输入订单名称'}]}>
                        <Input placeholder="请输入订单名称"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
