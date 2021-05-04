import React  from 'react';
import styles from './index.module.scss';
import { ShoppingCartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Card(props) {
    const goods = props.goods
    const handleClick = (index?) => {
        if(props.isEdit) {
            // 录入劳保品
            index === 1 ? props.editGoods(goods) : props.deleteGoods(goods);
        } else {
            // 加入申请列表
        }
    }
    const icon = (
        <>
            <EditOutlined style={{color: 'rgba(0,0,0,.7)', marginRight: 10}} onClick={() => {handleClick(1)}}/>
            <DeleteOutlined style={{color: 'rgb(218, 79, 67)'}} onClick={() => {handleClick(2)}} />
        </>
    )
    return(
        <div className={styles.card}>
            <div className={styles.img}>
                <img src={goods.img || 'http://localhost:3000/uploads/default.png'}></img>
            </div>
            <div className={styles.info}>
                <h4>{goods.name}</h4>
                <p>数量：{goods.amount}</p>
                <p title={goods.standard} className={styles.standard}>规格：{goods.standard}</p>
                <p className={styles.icon}>{props.isEdit ? icon  : <ShoppingCartOutlined style={{color: 'rgba(0,0,0,.7)'}} onClick={() => {handleClick()}}/>}</p>
            </div>
        </div>
    )
}