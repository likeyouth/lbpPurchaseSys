import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Card from '@/components/Card';
import service from '@/service/service';
import { request } from 'ice';
import { Pagination, Select, Input, Button, Modal, InputNumber, Upload, Form, Divider, message, Progress} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Search } = Input;
const {confirm} = Modal;

const layout = {
    labelCol: { span: 3},
    wrapperCol: { span: 20 },
};

export default function GoodManage() {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState<string>('');
    const [total, setTotal] = useState<number>(0);
    const [list,setList] = useState([]);
    const [category, setCategory] = useState([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [categoryId, setCategoryId] = useState(0);
    const [percentage, setPercent] = useState<number>(0);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [form] = Form.useForm();

    const getLbplist = (query?) => {
        query = query || {pageIndex: 1, pageSize:10}
        service.getLbplist(query).then(({total, list}) => {
            setTotal(total);
            setList(list);
        })
    };
    const getCategory = () => {
        service.getCategory().then(({total, list}) => {
            setCategory(list);
        })
    }
    useEffect(() => {
        getLbplist();
        getCategory();
    },[])

    const onSearch = val => {
        setValue(val);
        setPageIndex(1);
        const query = categoryId ? {pageIndex: 1, pageSize: 10, name: val, category: categoryId} : {pageIndex: 1, pageSize: 10, name: val};
        getLbplist(query)
    };
    const onPageChange = (pageIndex) => {
        setPageIndex(pageIndex);
        const category = categoryId ? categoryId : '';
        getLbplist({pageIndex: pageIndex, pageSize: 10, name: value, category: category});
    };
    const onSelectChange = (val) => {
        setValue('');
        setCategoryId(val);
        setPageIndex(1)
        getLbplist({pageIndex: 1, pageSize: 10, category: val ? val : ''})
    }
    const handleOk = () => {
        getLbplist();
        form.setFieldsValue({name: '', amount: 1, unit: '', standard: '', category: ''});
        setPercent(0);
        setVisible(false)
    }

    const handleEdit = (goods) => {
        form.setFieldsValue(goods)
        setIsUpdate(true);
        setVisible(true)
    }
    const addCategory = (name) => {
        if(!name) return;
        service.addCategory({name}).then(res => {
            if(res.code === 200) {
                message.info('添加成功');
                getCategory();
            }
        })
    }
    const onCustomRequest = ({file, onError,onProgress}) => {
        const body = form.getFieldsValue(true);
        console.log(body);
        // const {file} = options;
        // const {onProgress} = options;
        // const {onSuccess}
        const data = new FormData();
        data.append('goodsImg', file);
        data.append('amount', body.amount);
        data.append('name', body.name);
        data.append('standard', body.standard);
        data.append('unit', body.unit);
        data.append('category', body.category);
        const url = isUpdate ? '/goods/updateGoods' : '/goods/addGoods';
        isUpdate && data.append('lbpId', body.lbpId)
        console.log(url)
        request.post(url, data, {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: ({ total, loaded }) => {
                onProgress({ percent: Math.round((loaded / total) * 100) }, file);
            },
        }).then(res => {
            if(res.code === 200) {
                const text = isUpdate ? '修改成功' : '上传成功';
                message.info(text);
            } else {
                message.info('失败了，请稍后重试！');
            }
        }).catch(onError)
    }
    const uploadProps = {
        accept: "image/png,image/jpeg,image/gif,image/jpg",
        maxCount: 1,
        customRequest: onCustomRequest,
        onProgress({percent}, file) {
            console.log(percent);
            setPercent(percent)
        },
        onError(err){
            console.log(err);
        }
    }
    const handleDelete = (goods) => {
        console.log(goods)
        confirm({
            content: '确认删除该劳保品吗？',
            onOk: () => {
                service.deleteLbp({lbpId: goods.lbpId, file: goods.img.split('uploads/')[1]}).then(res => {
                    if(res.code === 200) {
                        message.info('删除成功！');
                        getLbplist();
                    } else {
                        message.info('删除失败');
                    }
                })
            }
        })
    }
    return (
        <div className={styles.goodsManage}>
            <h4 className={styles.title}>劳保品管理</h4>
            <div className={styles.search}>
                <Search style={{width: 235, marginRight: 10}} placeholder="请输入劳保品名称" onSearch={onSearch} enterButton />
                <Select style={{width: 235, marginRight: 10}} placeholder="请选择类别" onChange={onSelectChange}
                dropdownRender={menu => (
                    <div>
                        {menu}
                        <Divider style={{margin: '4px 0'}} />
                        <div style={{display: 'flex', flexWrap: 'nowrap',padding: 8}}>
                            <Search placeholder="添加的劳保品种类" onSearch={addCategory} enterButton="添加" />
                        </div>
                    </div>
                )}>
                    <Option value={0}>所有种类</Option>
                    {
                        category.map((item: {categoryId,name}) => {
                            return(
                                <Option key={item.categoryId} value={item.categoryId}>{item.name}</Option>
                            )
                        })
                    }
                </Select>
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setIsUpdate(false);
                }}>录入</Button>
            </div>
            <div className={styles.list}>
                {
                    list.map((item: {lbpId}) => {
                        return <Card isEdit={true} deleteGoods={() => {handleDelete(item)}} editGoods={() => {handleEdit(item)}} goods={item} key={item.lbpId} />
                    })
                }
            </div>
            <div className={styles.pagination}>
                <Pagination hideOnSinglePage onChange={onPageChange} defaultCurrent={1} total={total} />
            </div>
            <Modal title="劳保品录入" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                form.setFieldsValue({name: '', amount: 1, unit: '', standard: '', category: ''})
                setVisible(false)
            }}
            okText="确认" cancelText="取消">
                <Form {...layout} form={form}>
                    <Form.Item style={{display: 'none'}} name="lbpId"><Input /></Form.Item>
                    <Form.Item name="name" label="名称" rules={[{required: true, message: '请输入劳保品名称'}]}>
                        <Input placeholder="请输入劳保品名称"></Input>
                    </Form.Item>
                    <Form.Item name="standard" label="规格" rules={[{required: true, message: '请输入劳保品规格'}]}>
                        <Input placeholder="请输入劳保品规格"></Input>
                    </Form.Item>
                    <Form.Item name="category" label="类别" rules={[{required: true, message: '请选择劳保品类别'}]}>
                        <Select style={{width: 250, marginRight: 15}} placeholder="请选择类别">
                        {
                            category.map((item: {categoryId,name}) => {
                                return(
                                    <Option key={item.categoryId} value={item.categoryId}>{item.name}</Option>
                                )
                            })
                        }
                        </Select>
                    </Form.Item>
                    <Form.Item name="unit" label="单位" rules={[{required: true, message: '请输入劳保品单位'}]}>
                        <Input placeholder="请输入劳保品单位"></Input>
                    </Form.Item>
                    <Form.Item name="amount" label="数量" rules={[{required: true, message: '请输入劳保品数量'}]}>
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name="goodsImg" label="图片" rules={[{required: true, message: '请上传劳保品图片'}]}>
                        {/* @ts-ignore */}
                        <Upload
                            {...uploadProps}
                            showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                        <Progress style={{marginTop: 10}} percent={percentage} status={percentage === 100 ? 'success': percentage === 0? 'normal' : 'exception'} size="small" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}