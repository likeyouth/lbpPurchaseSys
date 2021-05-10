import React, { useState, useRef,useEffect} from 'react';
import styles from './index.module.scss';
import { Button, Form, Table, Modal, Input, Select, message } from 'antd';
import service from '@/service/service';
const {Option} = Select;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

export default function ApprovaledList (props) {
    const {isChange, setIsChange} = props;
    const [form] = Form.useForm();
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [plane, setPlane] = useState([]);
    const [replyId, setReplyId] = useState(0);
    const [isFirst, setIsFirst] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const query = useRef({
        pageIndex: 1,
        pageSize: 10,
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

    const columns = [
        {
            title: '序号',
            dataIndex: 'order',
            width: '5%'
        },
        {
            title: '劳保品名称',
            dataIndex: 'lbpName',
            width: '8%',
            ellipsis: true
        },
        {
            title: '图片',
            dataIndex: 'img',
            width: '8%',
            align: 'center',
            render: (url, record) => (
                <img src={url} style={{ width: 50, height: 30}}></img>
            )
        },
        {
            title: '申请数量',
            dataIndex: 'num',
            width: '8%'
        },
        {
            title: '规格',
            dataIndex: 'standard',
            width: '13%',
            ellipsis: true
        },
        {
            title: '申请人',
            dataIndex: 'applier',
            width: '10%'
        },
        {
            title: '审批人',
            dataIndex: 'replier',
            width: '10%'
        },
        {
            title: '审批回复',
            dataIndex: 'replyContent',
            width: '10%',
            ellipsis: true
        },
        {
            title: '状态',
            dataIndex: 'replyStatus',
            render: (status) => (<span>{status ? '已通过':'未通过'}</span>),
            width: '8%'
        },
        {
            title: '审批时间',
            dataIndex: 'createdAt',
            width: '10%'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: '10%',
            render: (op, row) => (
                <Button type="link" disabled={row.planeId || row.replyStatus === 0} onClick={() => {handleClick(row)}}>添加采购</Button>
            )
        }
    ]

    const handleClick = (record) => {
        setReplyId(record.replyId);
        setVisible(true)
    }

    const showSizeChanger = (current, pageSize) => {
        query.current.pageSize = pageSize;
        query.current.pageIndex = 1;
        getApprovalList({pageIndex: 1, pageSize: pageSize});
    }

    const onPageChange = (page) => {
        query.current.pageIndex = page;
        getApprovalList({pageIndex: page, pageSize: query.current.pageSize});
    }

    const rowSelected = {
        selectedRowKeys: selectedRowKeys,
        onChange: selectedKeys => {
            if(selectedRowKeys.length === 0) {
                setSelectedRowKeys(selectedKeys);
            } else {
                const fiterItems = selectedKeys.filter(item => {
                    return !selectedRowKeys.includes(item);
                });
                setSelectedRowKeys([...selectedRowKeys, ...fiterItems]);
            }
        },
        getCheckboxProps: (record) => ({
            disabled: record.planeId || record.replyStatus === 0
        })
    }

    const handleOk = () => {
        const userId = Number(sessionStorage.getItem('userId'));
        if(isFirst) {
            // 生成采购计划
            const values = form.getFieldsValue();
            values.userId = userId;
            values.replyIds = selectedRowKeys;
            service.addPlane(values).then(res => {
                if(res.code === 200) {
                    message.info('添加成功，请到采购计划列表中查看');
                    getApprovalList(query.current);
                    form.setFieldsValue({name: ''});
                    setSelectedRowKeys([]);
                } else {
                    message.info('添加失败，请稍后重试');
                }
            })
        } else {
            // 向采购计划添加记录
            const values = form.getFieldsValue();
            values.replyId = replyId;
            service.addOneReply(values).then(res => {
                if(res.code === 200) {
                    message.info('添加成功，请到采购计划列表中查看');
                    getApprovalList(query.current);
                }else {
                    message.info('添加失败，请稍后重试');
                    form.setFieldsValue({planeId: ''});
                }
            })
        }
        setIsFirst(false);
        setVisible(false);
    }

    const createPlane = () => {
        if(selectedRowKeys.length === 0) {
            message.info('请先勾选要加入采购计划的数据');
            return;
        } else {
            setIsFirst(true);
            setVisible(true);
        }
    }

    const getApprovalList = (query?) => {
        query = query || {pageIndex: 1, pageSize: 10};
        service.getApprovalList(query).then(res => {
            setData(res.data);
            setTotal(res.total);
        }).catch(err => {
            console.log(err);
        })
    }

    const getPlan = (query?) => {
        service.getPlan(query).then(res => {
            setPlane(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() =>{
        getApprovalList();
        getPlan();
    },[])

    useEffect(() => {
        if(isChange) {
            getApprovalList(query.current);
            setIsChange(false);
        }
    }, [isChange])
    return(
        <div className={styles.approvaledList}>
            <Button style={{marginBottom: 10}} type="primary" onClick={() => {createPlane()}}>生成采购计划</Button>
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
            <Modal title="生成采购计划" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                setVisible(false)
                setIsFirst(false)
            }}
            okText="确认" cancelText="取消">
                <Form {...layout} form={form}>
                    <Form.Item name={isFirst ? 'name' : 'planeId'} label="采购计划" rules={[{required: true}]}>
                        {
                            !isFirst ?
                            <Select placeholder="请选择采购计划">
                                {plane.map((item: {planeId, name}) => {
                                    return <Option key={item.planeId} value={item.planeId}>{item.name}</Option>
                                })}
                            </Select> :
                            <Input placeholder="采购计划名称" />
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
