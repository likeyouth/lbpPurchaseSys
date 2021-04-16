import React from 'react';
import styles from './index.module.scss';

export default function (props) {
    return(
        <div className={styles.bar}>
            <div className={styles.circle}>{props.barData.id}</div>
            <div className={styles.text}>{props.barData.supplier}</div>
            <div className={styles.graph}>
                <p style={{width: props.barData.percent}}></p>
            </div>
            <div className={styles.number}>{props.barData.orderNum}</div>
        </div>
    )
}
