import React, { useState, useRef,useEffect} from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import { Button, Form, Table, Modal, Input, message, Radio } from 'antd';
const {TextArea} = Input;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

export default function AppliedList (props) {
    const {setIsChange} = props;
    const [form] = Form.useForm()
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [isMore, setIsMore] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const initialValue = {status: 0, replyContent: ''};
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });

    const [selectedData, setSelectedData] = useState({selectedRows: [], selectedRowKeys: []})

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%'
        },
        {
            title: '劳保品名称',
            dataIndex: 'lbpName',
            width: '12%'
        },
        {
            title: '图片',
            dataIndex: 'img',
            width: '10%',
            align: 'center',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            width: '10%'
        },
        {
            title: '申请人',
            dataIndex: 'applier',
            width: '10%'
        },
        {
            title: '规格',
            dataIndex: 'standard',
            width: '18%',
            ellipsis: true
        },
        {
            title: '申请原因',
            dataIndex: 'reason',
            width: '15%',
            ellipsis: true
        },
        {
            title: '申请时间',
            dataIndex: 'createdAt',
            width: '10%',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '10%',
            render: (op, row) => (
                <Button type="link" onClick={() => {handleApproval(row)}}>审批</Button>
            )
        }
    ]

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getReply({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getReply({pageIndex: page, pageSize: query.current.pageSize});
    }

    const rowSelected = {
        selectedRowKeys: selectedData.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedData({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows });
        },
    }
    const addReply = (values) => {
        service.addReply(values).then(res => {
            if(res.code === 200) {
                message.info('审批成功！');
                setIsChange(true);
                getReply(query.current);
            } else {
                message.error('审批失败,请稍后重试！');
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const handleOk = () => {
        const userId = Number(sessionStorage.getItem('userId'));
        if(isMore) {
            // 批量审批
            const values = form.getFieldsValue();
            const body = selectedData.selectedRows.map((item:{requestId}) => ({
                userId: userId,
                requestId: item.requestId,
                status: values.status,
                replyContent: values.replyContent
            }));
            addReply(body);
        } else {
            // 单条审批
            const values = form.getFieldsValue();
            values.userId = userId;
            addReply(values);
        }
        form.setFieldsValue(initialValue);
        setVisible(false);
    }

    const handleApprovalAll = () => {
        if(!selectedData.selectedRows.length){
            message.error('请先选择数据');
        } else {
            setIsMore(true);
            setVisible(true);
        }
    }

    const handleApproval = (row) => {
        form.setFieldsValue({requestId: row.requestId});
        setIsMore(false);
        setVisible(true);
    }

    const getReply = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        service.getReply(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getReply();
    }, [])
    return(
        <div className={styles.appliedList}>
            <Button style={{marginBottom: 10}} type="primary" onClick={() => {handleApprovalAll()}}>批量审批</Button>
            <Table
            rowSelection={{...rowSelected}}
            size="small"
            bordered
            scroll={{ y: 400 }}
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
            <Modal title="采购审批" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                setVisible(false);
                form.setFieldsValue(initialValue);
            }}
            okText="确认" cancelText="取消">
                <Form initialValues={initialValue} {...layout} form={form}>
                    <Form.Item style={{display:'none'}} name="requestId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="是否通过" name="status" rules={[{required: true}]}>
                        <Radio.Group>
                            <Radio value={0}>不通过</Radio>
                            <Radio value={1}>通过</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="replyContent" label="审批回复" >
                        <TextArea
                        placeholder="审批回复内容"
                        autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
