import React, {useEffect}  from 'react';
import styles from './index.module.scss';
import service from '@/service/service';
import {message} from 'antd';
import { ShoppingCartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Card(props) {
    const goods = props.goods
    const handleClick = (index?) => {
        if(props.isEdit) {
            // 录入劳保品
            index === 1 ? props.editGoods(goods) : props.deleteGoods(goods);
        } else {
            // 加入申请列表
            const userId = Number(sessionStorage.getItem('userId'));
            service.addRequest({userId, lbpId: goods.lbpId}).then(res => {
                if(res.code === 200) {
                    message.info('添加成功，请到采购申请列表中查看~');
                } else {
                    message.info('添加失败，请稍后重试！');
                }
            })
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