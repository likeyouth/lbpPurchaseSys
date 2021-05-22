import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
const { TextArea } = Input;
const {confirm} = Modal;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function Applied(props) {
    const {shouldUpdate, setShouldUpdate} = props;
    const [form] = Form.useForm()
    const [total, setTotal] = useState(0);
    const [data,setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });
    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%',
            key: 'order'
        },
        {
            title: '名称',
            dataIndex: 'lbpName',
            width: '13%',
            key: 'lbpName',
            ellipsis: true
        },
        {
            title: '图片',
            dataIndex: 'img',
            width: '8%',
            key: 'img',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '规格',
            dataIndex: 'standard',
            width: '12%',
            ellipsis: true
        },
        {
            title: '数量',
            dataIndex: 'num',
            width: '5%',
            key: 'num'
        },
        {
            title: '申请原因',
            dataIndex: 'reason',
            render: (reason) => reason ? reason : '无',
            width: '10%',
            key: 'reason',
            ellipsis: true
        },
        {
            title: '申请时间',
            dataIndex: 'createdAt',
            width: '8%'
        },
        {
            title: '审批人',
            dataIndex: 'replier',
            width: '7%',
            key: 'replier'
        },
        {
            title: '状态',
            dataIndex: 'replyStatus',
            render: (status) => (<span style={{color: status === 0 ? 'rgba(255, 0, 0, .5)' : status === 1? 'rgb(14, 177, 175)' : ''}}>{getStatus(status)}</span>),
            width: '9%',
            key: 'replyStatus'
        },
        {
            title: '审批回复',
            dataIndex: 'replyContent',
            render: (reply) => reply ? reply :'未填写',
            width: '8%',
            key: 'replyContent',
            ellipsis: true
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '15%',
            key: 'operate',
            // 如果是通过审批的，不可以删除，审批未通过和还未审批的可以删除，审批未通过可以发起重新申请请求
            render: (op, row) => (
                <>
                    {
                        op.map((item, index) => {
                            return <Button key={index} type="link" disabled={index === 0 && row.replyStatus === 1 || index ===1 && row.replyStatus !== 0} onClick={() => {handleClick(row, index)}}>{item}</Button>
                        })
                    }
                </>
            )
        }
    ]

    const getStatus = (status) => {
        switch(status) {
            case 1: return '已通过';
            case 0: return '未通过';
            default: return '暂未审批';
        }
    }

    const handleClick = (record, index) => {
        if(index === 0) {
            // 删除
            confirm({
                content: '确认删除该条记录吗？',
                onOk: () => {
                    service.deleteRequest({requestId: record.requestId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                            getAppliedList(query.current);
                        } else {
                            message.error('删除失败，请稍后重试！');
                        }
                    })
                }
            })
        } else {
            // 重新申请：先删除本条申请记录，再重新添加新的记录
            form.setFieldsValue(record);
            setVisible(true);
        }
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getAppliedList({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getAppliedList({pageIndex: page, pageSize: query.current.pageSize})
    }


    const handleOk = () => {
        form.validateFields().then(values => {
            values.userId = Number(sessionStorage.getItem('userId'));
            service.reApply(values).then(res => {
                if(res.code === 200) {
                    message.info('重新申请成功！');
                    getAppliedList(query.current);
                } else {
                    message.info('重新申请失败，请稍后重试！');
                }
            })
            setVisible(false)
        })
    }

    const getAppliedList = (query?) => {
        const userId = Number(sessionStorage.getItem('userId'));
        if(query) {
            query.userId = userId;
        }
        query = query || {pageIndex: 1, pageSize: 10, userId: userId};
        service.getAppliedList(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getAppliedList();
    },[])

    useEffect(() => {
        if(shouldUpdate) {
            getAppliedList(query.current);
            setShouldUpdate(false);
        }
    }, [shouldUpdate])
    return(
        <div className={styles.applied}>
            <div className={styles.tableArea}>
                <Table
                    size="small"
                    bordered
                    scroll={{ y: 410 }}
                    dataSource={data}
                    // @ts-ignore
                    columns={columns}
                    pagination={{
                        total: total,
                        showQuickJumper: true,
                        onChange: onPageChange,
                        onShowSizeChange: showSizeChanger,
                        showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`
                    }}></Table>
            </div>
            <Modal title="重新申请" visible={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}
            okText="确认" cancelText="取消">
                <Form form={form} {...layout}>
                    <Form.Item style={{display: 'none'}} name="requestId">
                        <Input />
                    </Form.Item>
                    <Form.Item style={{display: 'none'}} name="lbpId">
                        <Input />
                    </Form.Item>
                    <Form.Item name="num" label="数量" rules={[{required: true, message: '数量必填'}]}>
                        <InputNumber min={1}></InputNumber>
                    </Form.Item>
                    <Form.Item name="reason" label="申请原因" rules={[{required: true, message: '申请原因必填'}]}>
                        <TextArea
                            placeholder="请输入申请原因"
                            autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}