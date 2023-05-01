import React, {useState} from 'react';
import styles from './Order.module.css'

const OrderForm = ({recipes, callback}) => {
    const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);

    const [obj, setObj] = useState( {
        recipeId: selectedRecipe.id,
        recipeName: selectedRecipe.recipeName,
        countOf: 1
    })
    const submitAction = (obj) => {
        if(obj.countOf <= 0 || obj.recipeId === -1)
            return;
        callback(obj);
        setObj({
            recipeId: selectedRecipe.id,
            recipeName: selectedRecipe.recipeName,
            countOf: 1
        })
    }
    return (
        <div className={styles.form}>
            <div className={styles.footer}>
                <select id="ingredient" value={selectedRecipe.id} onChange={(event) => {
                    setSelectedRecipe(event.target.value);
                    setObj({...obj, recipeId: event.target.value })
                }} className={styles.select}>
                    {recipes.map(x => {
                        return (
                            <option value={x.id} key={x.id}>{x.recipeName}</option>
                        )
                    })}
                </select>
                <label htmlFor="measure">Блюдо</label>

                <div>
                    <input id="price" className={styles.input} type="number"
                           value={obj.countOf}
                           onChange={(event) => setObj({...obj, countOf: event.target.value})}
                           placeholder={obj.countOf}/>
                    <div className="cut"></div>
                    <label htmlFor="price">Количество в заказе</label>
                </div>
                <button type="text" onClick={() => submitAction(obj)} className={styles.submit}>Submit</button>
            </div>
        </div>
    );
};

export default OrderForm;