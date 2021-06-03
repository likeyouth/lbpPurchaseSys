import React, {useState, useRef, useEffect} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
const { TextArea } = Input;
const { confirm } = Modal;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function WillApply(props) {
    const {setShouldUpdate} = props;
    const [form] = Form.useForm()
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);
    const [isMore,setIsMore] = useState<boolean>(false);
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
            title: '劳保品名称',
            dataIndex: 'lbpName',
            key: 'lbpName'
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
            key: 'standard'
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            // width: '10%'
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
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

    const handleClick = (index, record) => {
        if(index === 1) {
            // 删除
            confirm({
                content: <span>该条记录将被删除，是否继续？</span>,
                onOk() {
                    service.deleteRequest({requestId: record.requestId}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                            getWillApplyList(query.current);
                        } else {
                            message.error('删除失败，请稍后重试！');
                        }
                    })
                }
            })
        } else {
            // 申请
            form.setFieldsValue({requestId: record.requestId, num: record.num});
            setVisible(true);
        }
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize
        query.current.pageIndex = 1
        getWillApplyList({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getWillApplyList({pageIndex: page, pageSize: query.current.pageSize});
    }

    const handleOk = () => {
        if(isMore) {
            const value = form.getFieldsValue();
            const requestIds = selectedRowKeys.map(item => ({
                requestId: item,
                status: 1,
                reason: value.reason,
                num: value.num
            }));
            service.updateRequest({requestId: requestIds}).then(res => {
                if(res.code === 200) {
                    message.info('申请成功，请到申请列表查看！');
                    setShouldUpdate(true);
                    getWillApplyList({pageIndex: query.current.pageIndex -1 || 1, pageSize: query.current.pageSize});
                    setVisible(false);
                } else {
                    message.error('申请失败，请稍后重试！');
                }
            })
        } else {
            const values = form.getFieldsValue();
            values.status = 1; // 将申请状态置为已申请
            service.updateRequest(values).then(res => {
                if(res.code === 200) {
                    message.info('申请成功，请到申请列表查看');
                    setShouldUpdate(true);
                    getWillApplyList(query.current);
                    setVisible(false);
                } else {
                    message.info('申请失败，请稍后重试！');
                }
            })
        }
        setIsMore(false);
        form.setFieldsValue({reason: '', num: 1});
    }

    const rowDelete = {
        selectedRowKeys: selectedRowKeys,
        onChange: selectedKeys => {setSelectedRowKeys(selectedKeys)},
        getCheckboxProps: (record) => ({
            disabled: record.planeId || record.replyStatus === 0
        })
    }

    const handleApply = () => {
        if(selectedRowKeys.length) {
            setIsMore(true);
            setVisible(true);
        } else {
            message.warn('请先选择数据')
        }
    }
    const handleDelete = () => {
        if(selectedRowKeys.length) {
            confirm({
                content: <span>确认删除选中的数据吗？</span>,
                onOk() {
                    // const list = selectedData.map(item => item.requestId);
                    service.deleteRequest({requestId: selectedRowKeys}).then(res => {
                        if(res.code === 200) {
                            message.info('删除成功');
                            getWillApplyList(query.current);
                        } else {
                            message.info('删除失败，请稍后重试');
                        }
                    })
                }
            })
        } else {
            message.warn('请先选择数据')
        }
    }

    const getWillApplyList = (query?) => {
        const userId = Number(sessionStorage.getItem('userId'));
        if(query) {
            query.userId = userId;
        };
        query = query || {pageSize: 10, pageIndex: 1, userId: userId};
        service.getWillApplyList(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        })
    }

    useEffect(() => {
        getWillApplyList();
    }, []);
    return(
        <div className={styles.willApply}>
            <div className={styles.btns}>
                <Button type="primary" style={{marginRight: 10}} onClick={() => handleApply()}>批量申请</Button>
                <Button type="default" onClick={() => handleDelete()}>批量删除</Button>
            </div>
            <Table
            rowSelection={{
                ...rowDelete,
            }}
            size="small"
            bordered
            scroll={{ y: 390 }}
            dataSource={data}
            // @ts-ignore
            columns={columns}
            pagination={{
                total: total,
                showQuickJumper: true,
                onChange: onPageChange,
                onShowSizeChange: showSizeChanger,
                showTotal: (total, range) => `当前${range[0]}-${range[1]}条，共${total}条`,
                showSizeChanger:true
            }}></Table>
            <Modal title="新增申请" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                form.setFieldsValue({reason: ''});
                setVisible(false);
                setIsMore(false);
            }}
            okText="确认" cancelText="取消">
                <Form form={form} {...layout}>
                    <Form.Item style={{display: 'none'}} name="requestId">
                        <Input />
                    </Form.Item>
                    {
                        !isMore ?
                        <Form.Item name="num" label="数量" rules={[{required: true, message: '数量必填'}]}>
                            <InputNumber min={1}></InputNumber>
                        </Form.Item> : ''
                    }
                    <Form.Item name="reason" label="申请原因">
                        <TextArea
                            placeholder="请输入申请原因"
                            autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}