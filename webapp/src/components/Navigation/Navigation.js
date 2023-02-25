import React from 'react';
import {Link} from "react-router-dom";
import styles from './navigation.module.css'
import HomeIcon from './../UI/icons/Home'
import MeasureIcon from './../UI/icons/Measure'
import Ingredients from './../UI/icons/Ingredients'
import Cookbook from './../UI/icons/Cookbook'

const Navigation = () => {
    return (
        <div className={styles.custom_nav}>
            <div className={styles.nav_list}>
                <Link to={'/'} className={styles.nav_item}>
                    <HomeIcon/>
                    <span className={styles.a_text}>Главная</span>
                </Link>
                <Link to={'/measures'} className={styles.nav_item}>
                    <MeasureIcon/>
                    <span className={styles.a_text}>Единицы измерения</span>
                </Link>
                <Link to={'/ingredients'} className={styles.nav_item}>
                    <Ingredients/>
                    <span className={styles.a_text}>Ингридиенты (продукты)</span>
                </Link>
                <Link to={'/cookbook'} className={styles.nav_item}>
                    <Cookbook/>
                    <span className={styles.a_text}>Книга рецептов</span>
                </Link>
                <div className={styles.nav_item_devider}></div>
            </div>
        </div>
    );
};

export default Navigation;