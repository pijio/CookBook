import React, {useEffect, useState} from 'react';
import styles from './Ingredients.module.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchMeasures} from "../../redux/actions/measures";


const IngredientsForm = ({ingredient, forUpdateFlag, callback}) => {
    const measures = useSelector(({measures}) => measures.measures)
    const dispatcher = useDispatch()
    useEffect(() => {
        dispatcher(fetchMeasures())
    }, [])

    const [measuresState, setMeasures] = useState([])

    useEffect(() => {
        setMeasures(measures);
    }, [measures])
    const [measure, setMeasure] = useState(ingredient ? ingredient.measureId : 1);
    const formObj = !forUpdateFlag ? {name: "", price: 0, measureId: measure, measureName: " "} : ingredient;
    const [obj, setObj] = useState(formObj)

    function preCallback(ingredient) {
        const selectedMeasure = measuresState.find(x => x.id == ingredient.measureId)
        ingredient.measureName = selectedMeasure.measureName;
        callback(ingredient)
    }

    return (
        <div className={styles.form}>
            <div className={styles.subtitle}>{forUpdateFlag ? "Изменение продукта" : "Создание продукта"}</div>
            <div>
                <input id="name" className={styles.input} type="text"
                       value={obj.name}
                       onChange={(event) => setObj({...obj, name: event.target.value})}
                       placeholder={obj.name}/>
                <div className="cut"></div>
                <label htmlFor="name">Наименование продукта</label>
            </div>
            <div>
                <input id="price" className={styles.input} type="text"
                       value={obj.price}
                       onChange={(event) => setObj({...obj, price: event.target.value})}
                       placeholder={obj.price}/>
                <div className="cut"></div>
                <label htmlFor="price">Цена продукта</label>
            </div>
            <div className={styles.footer}>
                <select id="measure" value={measure} onChange={(event) => {
                    setMeasure(event.target.value);
                    setObj({...obj, measureId: event.target.value})
                }} className={styles.select}>
                    {measuresState.map(x => {
                        return (
                            <option value={x.id}>{x.measureName}</option>
                        )
                    })}
                </select>
                <label htmlFor="measure">Единица измерения продукта</label>
                <button type="text" onClick={() => preCallback(obj)} className={styles.submit}>Submit</button>
            </div>
        </div>
    );
};

export default IngredientsForm;