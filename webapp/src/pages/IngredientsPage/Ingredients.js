import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchIngredients, updateMeasures} from "../../redux/actions/ingredients";
import styles from './Ingredients.module.css'
import IngredientRow from "./IngredientsRow";
import IngredientForm from "./IngredientsForm";
import Modal from "../../components/UI/Modal/Modal";
import axios from "axios";

const Ingredients = () => {

    const dispatcher = useDispatch();
    const items = useSelector(({ingredients}) => ingredients.ingredients)
    useEffect(() => {
        dispatcher(fetchIngredients())
    },[])

    const [ingredientsState, setIngredientsState] = useState([])

    useEffect(() => {
        setIngredientsState(items);
    }, [items]);

    const deleteIngredient = (ingredient) => {
        deleteingredientRequest(ingredient)
        const newItems = ingredientsState.filter(item => item.id !== ingredient.id)
        setIngredientsState(newItems)
        dispatcher(updateMeasures(newItems))

    }

    const [addModalState, setAddModalState] = useState(false)

    const addIngredient = (newingredient) => {
        addingredientRequest(newingredient)
        const newItems = [...ingredientsState, newingredient]
        setIngredientsState(newItems)
        setAddModalState(false)
        dispatcher(updateMeasures(newItems))
    }
    const editIngredient = (editedingredient) => {
        editingredientRequest(editedingredient)
        const newItems = ingredientsState.map(x => x.id === editedingredient.id ? editedingredient : x)
        setIngredientsState(newItems)
        dispatcher(updateMeasures(newItems))


    }

    const editingredientRequest = async (ingredient) => {
        await axios.put(`https://localhost:5001/api/ingredients/updateIngredients`, ingredient).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const addingredientRequest = async (ingredient) => {
        console.log(ingredient)
        await axios.post(`https://localhost:5001/api/ingredients/addIngredients`, ingredient).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const deleteingredientRequest = async (ingredient) => {
        await axios.post(`https://localhost:5001/api/ingredients/deleteIngredients`, ingredient).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const cb = {deleteIngredient, addIngredient, editIngredient};
    return (
        <div className={styles.ingredients}>
            <h1>
                Ингредиенты (продукты)
            </h1>
            <Modal visible={addModalState} setVisible={setAddModalState}>
                <IngredientForm forUpdateFlag={false} callback={addIngredient}>

                </IngredientForm>
            </Modal>
            <div className={styles.table_wrapper}>
                <table className={styles.fl_table}>
                    <thead>
                    <tr>
                        <th>Наименование продукта</th>
                        <th>Цена</th>
                        <th>Единица измерения</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ingredientsState.map((ingredient) => (
                        <IngredientRow ingredient={ingredient} key={ingredient.id} callbacks={cb}></IngredientRow>))}
                    <tr>
                        <td>...</td>
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

export default Ingredients;