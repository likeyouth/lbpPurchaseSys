import React from 'react';
import styles from './index.module.scss';

export default function OrderStatistic() {
    return(
        <div className={styles.orderStatistic}>
            <div className={styles.card}>
                <div className={styles.cardItem}>
                    <p className={styles.icon}></p>
                    <div className={styles.text}>
                        <span className={styles.title}>头部护具类</span>
                        <span className={styles.number}>10,000</span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <p className={styles.icon}></p>
                    <div className={styles.text}>
                        <span className={styles.title}></span>
                        <span className={styles.number}></span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <p className={styles.icon}></p>
                    <div className={styles.text}>
                        <span className={styles.title}></span>
                        <span className={styles.number}></span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <p className={styles.icon}></p>
                    <div className={styles.text}>
                        <span className={styles.title}></span>
                        <span className={styles.number}></span>
                    </div>
                </div>
                <div className={styles.cardItem}>
                    <p className={styles.icon}></p>
                    <div className={styles.text}>
                        <span className={styles.title}></span>
                        <span className={styles.number}></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
