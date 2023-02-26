import React, {useState} from 'react';
import axios from "axios";
import styles from './Home.module.css'

const Home = () => {
    const [portions, setPortions] = useState(1);
    async function getReport() {
        axios({
            url: 'https://localhost:5001/api/recipes/getReport?portions=' + portions,
            method: 'POST',
            responseType: 'blob'
        }).then(response => {
                console.log(response)
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.xlsx'); // добавляем атрибут download
                document.body.appendChild(link);
                link.click();
        });
    }

    function increment() {
        setPortions(portions + 1)
    }

    function decrement() {
        if(portions===1) return;
        setPortions(portions - 1)
    }

    return (
        <div className={styles.home}>
            <h1>
                Главная
            </h1>
            <h2>
                Отчет по рецептам
            </h2>

            <h4>
                Задайте количество порций на каждый рецепт
            </h4>
            <div className={styles.counter}>
                <button className={styles.dec} onClick={decrement}>-</button>
                <h2>{portions}</h2>
                <button className={styles.inc} onClick={increment}>+</button>
            </div>
            <button className={styles.getReport} onClick={getReport}>Выгрузить отчет</button>
        </div>
    );
};

export default Home;