import React from 'react';
import styles from './index.module.scss';
import Card from '@/components/Card';
import { Pagination, Input } from 'antd';
const { Search } = Input;

const goodlist = [
    { id: 1, name: '防护手套', amount: 100, unit: '双', date: '2020-04-11' },
    { id: 2, name: '劳保鞋子', amount: 100, unit: '双', date: '2020-04-11' },
    { id: 3, name: '药箱', amount: 100, unit: '个', date: '2020-04-11' },
    { id: 4, name: '创口贴', amount: 100, unit: '个', date: '2020-04-11' },
    { id: 5, name: '消毒水', amount: 100, unit: '瓶', date: '2020-04-11' },
    { id: 6, name: '棉签', amount: 100, unit: '包', date: '2020-04-11' },
    { id: 7, name: '安全帽', amount: 100, unit: '个', date: '2020-04-11' },
    { id: 8, name: '防毒面具', amount: 100, unit: '个', date: '2020-04-11' },
    { id: 9, name: '安全帽', amount: 100, unit: '个', date: '2020-04-11' },
    { id: 10, name: '防毒面具', amount: 100, unit: '个', date: '2020-04-11' }
]

export default function GoodLIst() {
    const onSearch = value => console.log(value);

    return (
        <div className={styles.goods}>
            <h4 className={styles.title}>劳保品列表</h4>
            <div className={styles.search}>
            <Search placeholder="请输入劳保品名称" onSearch={onSearch} enterButton />
            </div>
            <div className={styles.list}>
                {
                    goodlist.map(item => {
                        return <Card goods={item} key={item.id} />
                    })
                }
            </div>
            <div className={styles.pagination}>
                <Pagination defaultCurrent={1} total={50} />
            </div>
        </div>
    )
}