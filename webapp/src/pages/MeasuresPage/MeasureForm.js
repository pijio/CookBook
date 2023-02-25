import React, {useState} from 'react';
import styles from './Measures.module.css'


const MeasureForm = ({measure, forUpdateFlag, callbackMeasure}) => {
    const formObj = !forUpdateFlag ? { measureName: " ", measureSymbol: " "} : measure;
    const callback = !forUpdateFlag ? callbackMeasure.addMeasure : callbackMeasure.editMeasure;
    const [obj, setObj] = useState(formObj)
    return (
        <div className={styles.form}>
            <div className={styles.subtitle}>{forUpdateFlag ? "Изменение ед. измерения" : "Создание ед. измерения"}</div>
            <div>
                <input id="measureName" className={styles.input} type="text"
                       onChange={(event) => setObj({...obj, measureName: event.target.value})}
                       placeholder={obj.measureName}/>
                <div className="cut"></div>
                <label htmlFor="measureName">Наименование единицы измерения</label>
            </div>
            <div className="input-container ic2">
                <input id="measureSymbol" onChange={(event) => setObj({...obj, measureSymbol: event.target.value})}
                       className={styles.input} type="text" placeholder={obj.measureSymbol}/>
                <div className="cut"></div>
                <label htmlFor="measureSymbol">Символ единицы измерения</label>
            </div>
            <button type="text" onClick={() => callback(obj)} className={styles.submit}>Submit</button>
        </div>
    );
};

export default MeasureForm;