import React  from 'react';
import styles from './index.module.scss';
import { ShoppingCartOutlined, EditOutlined } from '@ant-design/icons';

export default function Card(props) {
    const goods = props.goods
    const handleClick = () => {
        if(props.isEdit) {
            // 录入劳保品
            props.editGoods(goods)
        } else {
            // 加入申请列表
        }
    }
    return(
        <div className={styles.card}>
            <div className={styles.img}>
                <img src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fimgextra%2Fi1%2FTB1oy6wcH1YBuNjSszhXXcUsFXa_%21%210-item_pic.jpg_400x400.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620712347&t=e207916d762d25c482170755a177b447'></img>
            </div>
            <div className={styles.info}>
                <h4>{goods.name}</h4>
                <p>数量：{goods.amount}</p>
                <p>日期：{goods.date}</p>
                <p className={styles.icon}>{props.isEdit ? <EditOutlined style={{color: 'rgb(0,0,0,.7)'}} onClick={() => {handleClick()}}/> : <ShoppingCartOutlined style={{color: 'rgb(0,0,0,.7)'}} onClick={() => {handleClick()}}/>}</p>
            </div>
        </div>
    )
}