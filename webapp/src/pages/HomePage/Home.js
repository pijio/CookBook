import React, {useState} from 'react';
import axios from "axios";
import styles from './Home.module.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(startDate.getDate() + 7)));
    async function getReport() {
        if(startDate > endDate)
            return
        axios({
            url: 'https://localhost:5001/api/orders/getReport?from='+startDate.toISOString()+'&to='+endDate.toISOString(),
            method: 'GET',
            responseType: 'blob'
        }).then(response => {
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx'); // добавляем атрибут download
            document.body.appendChild(link);
            link.click();
        });
    }

    return (
        <div className={styles.home}>
            <h1>
                Главная
            </h1>
            <h2>
                Отчет по заказам
            </h2>
            <div className={styles.periodPicker}>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
            <button className={styles.getReport} onClick={getReport}>Выгрузить отчет</button>
        </div>
    );
};

export default Home;