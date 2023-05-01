import React, {useEffect, useState} from 'react';
import styles from './Order.module.css'
import OrderItemRow from "./OrderItemRow";
import {useDispatch, useSelector} from "react-redux";
import {fetchRecipes} from "../../redux/actions/cookbook";
import Modal from "../../components/UI/Modal/Modal";
import OrderForm from "./OrderForm";
import axios from "axios";
const Order = () => {
    const [addModalState, setAddModalState] = useState(false)
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState([])
    const [makeOrderCallback, setMakeOrderCallback] = useState('');


    const dispatcher = useDispatch();
    const availableRecipes = useSelector(({cookbook}) => cookbook.recipes)

    useEffect(() => {
        dispatcher(fetchRecipes()).finally(() => {
            setLoading(false);
        });
    },[])

    if(loading) {
        console.log(loading)
        return <h4>Загружаем ингридиенты</h4>
    }

    const addRecipe = (recipe) => {
        if(recipes.length === 0) {
            setMakeOrderCallback('')
        }
        const index = recipes.findIndex(x => x.recipeId === recipe.recipeId);
        if(index !== -1) {
            const updatedRecipes = [...recipes]
            updatedRecipes[index].countOf += recipe.countOf
            setRecipes(updatedRecipes)
        }
        else
            setRecipes([...recipes, recipe])
        setAddModalState(false)
    }


    const deleteRecipe = (recipe) => {
        setRecipes(recipes.filter(r => r.id !== recipe.id))
    }

    const changeCountOf = (recipeId, incOrDec) => {
        const index = recipes.findIndex(x => x.recipeId === recipeId);
        if(index !== -1) {
            const updatedRecipes = [...recipes]
            updatedRecipes[index].countOf += incOrDec ? 1 : -1
            setRecipes(updatedRecipes)
        }
    }

    const makeOrder = async () => {
        const data = { items: recipes.map(({recipeName, ...recipe}) => recipe) }
        try {
            await axios.post(`https://localhost:5001/api/orders/makeorder`, data);
        } catch (error) {
            setMakeOrderCallback('Произошла ошибка при создании заказа: ' + error.toLocaleString())
            throw new Error('Не удалось получить ответ от API');
        }
        setMakeOrderCallback('Заказ создан')
        setRecipes([])

    }
    const cb = {addRecipe, deleteRecipe, changeCountOf}

    return (
        <div className={styles.orders}>
            <h1>Форма создания заказа</h1>

            <Modal visible={addModalState} setVisible={setAddModalState}>
                <OrderForm recipes={availableRecipes} callback={cb.addRecipe}></OrderForm>
            </Modal>
            <div className={styles.table_wrapper}>
                <table className={styles.fl_table}>
                    <thead>
                    <tr>
                        <th>Наименование блюда</th>
                        <th>Количество в заказе</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recipes.map((recipe) => ( recipe!==null ?
                            <OrderItemRow recipeItem={recipe} callbacks={cb} key={recipe.recipeIngredientId}></OrderItemRow> : <></>
                    ))}
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
            <div>{makeOrderCallback}</div>
            <button onClick={() => makeOrder()} className={[styles.button, styles.default].join(' ')}>Сделать заказ</button>
        </div>
    );
};

export default Order;