import React, {useState} from 'react';
import styles from './CookBook.module.css'
import Modal from "../../components/UI/Modal/Modal";
import RecipeIngredientRow from "./RecipeIngredientRow";
import RecipeIngredientForm from "./RecipeIngredientForm";
import Dropdown from "../../components/UI/Dropdown/Dropdown";
import axios from "axios";

const Recipe = ({recipe, removeCallback}) => {
    const [addModalState, setAddModalState] = useState(false)

    const [ingredients, setIngredients] = useState(recipe.ingredients)

    async function addIngredient(ingredient)  {
        if(ingredients.map(obj => parseInt(obj.ingredient.id)).includes(parseInt(ingredient.ingredient.id)))
        {
            setAddModalState(false)
            return
        }
        const id = await addRecipeIngredientRequest(ingredient)
        ingredient = {...ingredient, recipeIngredientId: id}
        const newItems = [...ingredients, ingredient]
        setIngredients(newItems)
        setAddModalState(false)
    }


    function deleteIngredient(ingredient)  {

        deleteRecipeIngredientRequest(ingredient)
        const newItems = ingredients.filter(item => item.recipeIngredientId !== ingredient.recipeIngredientId)
        setIngredients(newItems)
    }

    const addRecipeIngredientRequest = async (recipeIngredient) => {
        const data = {
            countOf: recipeIngredient.countOf,
            ingredientId: recipeIngredient.ingredient.id,
            recipeId: recipeIngredient.recipeId
        };
        console.log(data)
        try {
            await axios.post(`https://localhost:5001/api/recipes/addRecipeIngredient`, data);
            const result = await axios.post('https://localhost:5001/api/recipes/getRecipeIngredientId', data);
            return result.data;
        } catch (error) {
            console.log(error);
            throw new Error('Не удалось получить ответ от API');
        }
    }

    const deleteRecipeIngredientRequest = async (recipeIngredient) => {
        await axios.post(`https://localhost:5001/api/recipes/deleteRecipeIngredient`, {
            countOf: recipeIngredient.countOf,
            ingredientId: recipeIngredient.ingredient.id,
            recipeId: recipeIngredient.recipeId,
            id: recipeIngredient.recipeIngredientId
        }).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
    }

    const cb = {addIngredient, deleteIngredient}
    console.log(ingredients)
    return (
        <Dropdown name={recipe.recipeName}>
            <Modal visible={addModalState} setVisible={setAddModalState}>
                <RecipeIngredientForm callback={cb.addIngredient}
                                      forUpdateFlag={false} recipeId={recipe.id}></RecipeIngredientForm>
            </Modal>
            <div className={styles.recipe}>
                <h4>Наименование блюда: {recipe.recipeName}</h4>
                <div className={styles.description}>Комментарии по приготовлению: {recipe.recipeComment}</div>
                <div className={styles.table_wrapper}>
                    <table className={styles.fl_table}>
                        <thead>
                        <tr>
                            <th>Наименование продукта</th>
                            <th>Количество на 1 блюдо</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ingredients.map((ingredient) => ( ingredient!==null ?
                            <RecipeIngredientRow ingredient={ingredient} callbacks={cb} key={ingredient.recipeIngredientId}></RecipeIngredientRow> : <></>
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
                <button onClick={() => removeCallback(recipe)} className={[styles.button, styles.red].join(' ')}>Удалить</button>
            </div>
        </Dropdown>
    );
};

export default Recipe;