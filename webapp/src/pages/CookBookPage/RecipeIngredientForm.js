import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchIngredients} from "../../redux/actions/ingredients";
import styles from "../IngredientsPage/Ingredients.module.css";

const RecipeIngredientForm = ({ingredient, forUpdateFlag, callback, recipeId}) => {
    const dispatcher = useDispatch();
    const items = useSelector(({ingredients}) => ingredients.ingredients)
    useEffect(() => {
        dispatcher(fetchIngredients())
    },[])

    const [ingredients, setIngredients] = useState([])
    const [selectedIng, setSelectedIng] = useState(ingredient ? ingredient.id : 1);

    useEffect(() => {
        setIngredients(items);
    }, [items]);

    const formObj = !forUpdateFlag ? {
        ingredient: { name: "", measureSymbol: "", id: 1 },
        countOf: 0,
        recipeId: recipeId,
    } : {
        recipeIngredient: recipeId,
        recipeId: ingredient.ingredient.id,
        countOf: ingredient.countOf,
        ingredient: { name: ingredient.ingredient.name, measureSymbol: ingredient.ingredient.measureSymbol, id: ingredient.ingredient.id }
    }
    const [obj, setObj] = useState(formObj)

    function preCallback(ingredient) {
        const selectedIng = ingredients.find(x => x.id == ingredient.ingredient.id)
        ingredient.ingredient = {
            ...ingredient.ingredient,
            name: selectedIng.name,
            measureSymbol: selectedIng.measureSymbol
        };
        callback(ingredient)
    }
    return (
        <div className={styles.form}>
            <div className={styles.footer}>
                <select id="ingredient" value={selectedIng} onChange={(event) => {
                    setSelectedIng(event.target.value);
                    setObj({...obj, ingredient: { ...obj.ingredient, id: event.target.value } })
                }} className={styles.select}>
                    {ingredients.map(x => {
                        return (
                            <option value={x.id} key={x.id}>{x.name}</option>
                        )
                    })}
                </select>
                <label htmlFor="measure">Ингредиент</label>

                <div>
                    <input id="price" className={styles.input} type="text"
                           value={obj.countOf}
                           onChange={(event) => setObj({...obj, countOf: event.target.value})}
                           placeholder={obj.countOf}/>
                    <div className="cut"></div>
                    <label htmlFor="price">Количество на 1 ед. блюда</label>
                </div>
                <button type="text" onClick={() => preCallback(obj)} className={styles.submit}>Submit</button>
            </div>
        </div>
    );
};

export default RecipeIngredientForm;