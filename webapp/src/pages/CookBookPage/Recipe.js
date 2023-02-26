import React, {useState} from 'react';
import styles from './CookBook.module.css'
import Modal from "../../components/UI/Modal/Modal";
import RecipeIngredientRow from "./RecipeIngredientRow";
import RecipeIngredientForm from "./RecipeIngredientForm";
import Dropdown from "../../components/UI/Dropdown/Dropdown";

const Recipe = ({recipe, removeCallback}) => {
    const [addModalState, setAddModalState] = useState(false)

    const [ingredients, setIngredients] = useState(recipe.ingredients)

    function addIngredient(ingredient)  {
        if(ingredients.map(obj => parseInt(obj.ingredient.id)).includes(parseInt(ingredient.ingredient.id)))
        {
            setAddModalState(false)
            return
        }
        const newItems = [...ingredients, ingredient]
        setIngredients(newItems)
        setAddModalState(false)
    }


    function deleteIngredient(ingredient)  {
        const newItems = ingredients.filter(item => item.recipeIngredientId !== ingredient.recipeIngredientId)
        setIngredients(newItems)
        console.log(newItems)
    }

    const cb = {addIngredient, deleteIngredient}

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
                        {ingredients.map((ingredient) => (
                            <RecipeIngredientRow ingredient={ingredient} callbacks={cb} key={ingredient.recipeIngredientId}></RecipeIngredientRow>
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