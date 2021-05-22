import React from 'react';
import styles from './index.module.scss';

export default function (props) {
    function getBgColor(index) {
        switch(index) {
            case 1: return '#FF3A30';
            case 2:return '#FF9502';
            case 3: return '#00BB7A';
            default: return '#C7CFCC';
        }
    }
    return(
        <div className={styles.bar}>
            <div style={{backgroundColor: getBgColor(props.index)}} className={styles.circle}>{props.index}</div>
            <div className={styles.text}>{props.barData.supplier}</div>
            <div className={styles.graph}>
                <p style={{width: props.barData.percent}}></p>
            </div>
            <div className={styles.number}>{props.barData.orderNum}</div>
        </div>
    )
}
