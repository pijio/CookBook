import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchMeasures, updateMeasures} from "../../redux/actions/measures";
import styles from './Measures.module.css'
import MeasureRow from "./MeasureRow";
import MeasureForm from "./MeasureForm";
import Modal from "../../components/UI/Modal/Modal";
import axios from "axios";

const Measures = () => {

    const dispatcher = useDispatch();
    const items = useSelector(({measures}) => measures.measures)
    useEffect(() => {
        dispatcher(fetchMeasures())
    },[])

    const [measureState, setMeasuresState] = useState([])

    useEffect(() => {
        setMeasuresState(items);
    }, [items]);

    const deleteMeasure = (measure) => {
        deleteMeasureRequest(measure)
        const newItems = measureState.filter(item => item.id !== measure.id)
        setMeasuresState(newItems)
        dispatcher(updateMeasures(newItems));
    }

    const [addModalState, setAddModalState] = useState(false)

    const addMeasure = (newMeasure) => {
        addMeasureRequest(newMeasure)
        const newItems = [...measureState, newMeasure]
        setMeasuresState(newItems)
        setAddModalState(false)
        dispatcher(updateMeasures(newItems));

    }
    const editMeasure = (editedMeasure) => {
        editMeasureRequest(editedMeasure)
        const newItems = measureState.map(x => x.id === editedMeasure.id ? editedMeasure : x)
        setMeasuresState(newItems)
        dispatcher(updateMeasures(newItems));
    }

    const editMeasureRequest = async (measure) => {
        await axios.put(`https://localhost:5001/api/measures/updateMeasures`, measure).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const addMeasureRequest = async (measure) => {
        await axios.post(`https://localhost:5001/api/measures/addMeasures`, measure).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const deleteMeasureRequest = async (measure) => {
        await axios.post(`https://localhost:5001/api/measures/deleteMeasures`, measure).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const cb = {deleteMeasure, addMeasure, editMeasure}
    return (
            <div className={styles.measures}>
            <h1>
                Единицы измерения
            </h1>
            <Modal visible={addModalState} setVisible={setAddModalState}>
                <MeasureForm forUpdateFlag={false} callbackMeasure={cb}>

                </MeasureForm>
            </Modal>
            <div className={styles.table_wrapper}>
                <table className={styles.fl_table}>
                    <thead>
                    <tr>
                        <th>Наименование единицы измерения</th>
                        <th>Короткий символ единицы измерения</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {measureState.map((measure) => (
                        <MeasureRow measure={measure} key={measure.id} callbacks={cb}></MeasureRow>))}
                    <tr>
                        <td>...</td>
                        <td>...</td>
                        <td>
                            <button onClick={() => setAddModalState(true)} className={[styles.button, styles.default].join(' ')}>Добавить</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Measures;