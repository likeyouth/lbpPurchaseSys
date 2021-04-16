import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Card from '@/components/Card';
import { Pagination, Select, Input, Button, Modal, InputNumber, Upload, Form} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Search } = Input;

const goodlist = [
    { id: 1, name: '防护手套', amount: 100, unit: '双', date: '2020-04-11', category: 'category1', standard: '双'},
    { id: 2, name: '劳保鞋子', amount: 100, unit: '双', date: '2020-04-11', category: 'category1', standard: '双'},
    { id: 3, name: '药箱', amount: 100, unit: '个', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 4, name: '创口贴', amount: 100, unit: '个', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 5, name: '消毒水', amount: 100, unit: '瓶', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 6, name: '棉签', amount: 100, unit: '包', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 7, name: '安全帽', amount: 100, unit: '个', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 8, name: '防毒面具', amount: 100, unit: '个', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 9, name: '安全帽', amount: 100, unit: '个', date: '2020-04-11', category: 'category1', standard: '双' },
    { id: 10, name: '防毒面具', amount: 100, unit: '个', date: '2020-04-11', category: 'category1', standard: '双' }
]

const layout = {
    labelCol: { span: 3},
    wrapperCol: { span: 20 },
};

export default function GoodManage() {
    const [visible, setVisible] = useState(false)
    const [fileList, setFileList] = useState<any[]>([])
    const [form] = Form.useForm();
    const onSearch = value => console.log(value);
    const onChange = val => console.log(val)

    const handleOk = () => {
        form.setFieldsValue({name: '', amount: 1, unit: '', standard: '', category: ''})
        setFileList([])
        setVisible(false)
    }

    const onFileChange = (file) => {
        console.log(file)
    }

    const handleEdit = (goods) => {
        setFileList([{uid: '-1', name: goods.name, status: 'done', url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB1oy6wcH1YBuNjSszhXXcUsFXa_%21%210-item_pic.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620712347&t=e207916d762d25c482170755a177b447'}])
        form.setFieldsValue(goods)
        setVisible(true)
    }
    return (
        <div className={styles.goodsManage}>
            <h4 className={styles.title}>劳保品管理</h4>
            <div className={styles.search}>
                <Select style={{width: 250, marginRight: 15}} placeholder="请选择类别" onChange={onChange}>
                    <Option value="category1">头部护具类</Option>
                    <Option value="category2">呼吸护具类</Option>
                    <Option value="category3">眼(面)护具类</Option>
                    <Option value="category4">防护服类</Option>
                    <Option value="category5">防护鞋类</Option>
                    <Option value="category6">防坠落护具类</Option>
                </Select>
                <Search style={{width: 250, marginRight: 15}} placeholder="请输入劳保品名称" onSearch={onSearch} enterButton />
                <Button type="primary" onClick={() => setVisible(true)}>录入</Button>
            </div>
            <div className={styles.list}>
                {
                    goodlist.map(item => {
                        return <Card editGoods={handleEdit} isEdit={true} goods={item} key={item.id} />
                    })
                }
            </div>
            <div className={styles.pagination}>
                <Pagination defaultCurrent={1} total={50} />
            </div>
            <Modal title="劳保品录入" visible={visible}
            onOk={handleOk}
            onCancel={() => {
                form.setFieldsValue({name: '', amount: 1, unit: '', standard: '', category: ''})
                setFileList([])
                setVisible(false)
            }}
            okText="确认" cancelText="取消">
                <Form {...layout} form={form}>
                    <Form.Item name="name" label="名称" rules={[{required: true, message: '请输入劳保品名称'}]}>
                        <Input placeholder="请输入劳保品名称"></Input>
                    </Form.Item>
                    <Form.Item name="standard" label="规格" rules={[{required: true, message: '请输入劳保品规格'}]}>
                        <Input placeholder="请输入劳保品规格"></Input>
                    </Form.Item>
                    <Form.Item name="category" label="类别" rules={[{required: true, message: '请选择劳保品类别'}]}>
                        <Select style={{width: 250, marginRight: 15}} placeholder="请选择类别" onChange={onChange}>
                            <Option value="category1">头部护具类</Option>
                            <Option value="category2">呼吸护具类</Option>
                            <Option value="category3">眼(面)护具类</Option>
                            <Option value="category4">防护服类</Option>
                            <Option value="category5">防护鞋类</Option>
                            <Option value="category6">防坠落护具类</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="unit" label="单位" rules={[{required: true, message: '请输入劳保品单位'}]}>
                        <Input placeholder="请输入劳保品单位"></Input>
                    </Form.Item>
                    <Form.Item name="amount" label="数量" rules={[{required: true, message: '请输入劳保品数量'}]}>
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name="img" label="图片" rules={[{required: true, message: '请上传劳保品图片'}]}>
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture"
                            accept="image/png, image/jpeg"
                            maxCount={1}
                            fileList={fileList}
                            onChange={onFileChange}
                            className="upload-list-inline">
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}