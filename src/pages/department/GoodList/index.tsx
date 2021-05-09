import React, { useState,useEffect } from 'react';
import styles from './index.module.scss';
import Card from '@/components/Card';
import { Pagination, Input, Select } from 'antd';
import service from '@/service/service';
const { Search } = Input;
const { Option } = Select;

export default function GoodLIst() {
    const [value, setValue] = useState<string>('');
    const [total, setTotal] = useState<number>(0);
    const [list,setList] = useState([]);
    const [category, setCategory] = useState([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [current,setCurrent] = useState<number>(1);
    const [categoryId, setCategoryId] = useState(0);

    const getLbplist = (query?) => {
        query = query || {pageIndex: 1, pageSize:10}
        service.getLbplist(query).then(({total, list}) => {
            setTotal(total);
            setList(list);
        })
    };
    const getCategory = (query?) => {
        service.getCategory(query).then(({total, list}) => {
            setCategory(list);
        })
    }

    useEffect(()=>{
        getLbplist();
        getCategory();
    }, []);

    const onSearch = val => {
        setValue(val);
        setPageIndex(1);
        const query = categoryId ? {pageIndex: 1, pageSize: 10, name: val, category: categoryId} : {pageIndex: 1, pageSize: 10, name: val};
        getLbplist(query)
    };

    const onPageChange = (pageIndex) => {
        setPageIndex(pageIndex);
        setCurrent(pageIndex);
        const category = categoryId ? categoryId : '';
        getLbplist({pageIndex: pageIndex, pageSize: 10, name: value, category: category});
    };
    const onSelectChange = (val) => {
        setValue('');
        setCategoryId(val);
        setPageIndex(1)
        getLbplist({pageIndex: 1, pageSize: 10, category: val ? val : ''})
    }
    return (
        <div className={styles.goods}>
            <h4 className={styles.title}>劳保品列表</h4>
            <div className={styles.search}>
                <Search style={{width: 235}} placeholder="请输入劳保品名称" onSearch={onSearch} enterButton />
                <Select showSearch style={{width: 235, marginLeft: 10}} placeholder="请选择劳保品种类" optionFilterProp="children"
                onChange={onSelectChange}>
                    <Option value={0}>所有种类</Option>
                    {
                        category.map((item: {categoryId,name}) => {
                            return(
                                <Option key={item.categoryId} value={item.categoryId}>{item.name}</Option>
                            )
                        })
                    }
                </Select>
            </div>
            <div className={styles.list}>
                {
                    list.map((item: {lbpId}) => {
                        return <Card goods={item} key={item.lbpId} />
                    })
                }
            </div>
            <div className={styles.pagination}>
                <Pagination hideOnSinglePage onChange={onPageChange} showQuickJumper current={current} total={total} />
            </div>
        </div>
    )
}