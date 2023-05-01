import React, {useState} from 'react';
import styles from "../IngredientsPage/Ingredients.module.css";

const RecipeIngredientRow = ({ingredient, callbacks}) => {
    return (
        <tr key={ingredient.recipeIngredientId}>
            <td>{ingredient.ingredient.name}</td>
            <td>{ingredient.countOf + ' ' + ingredient.ingredient.measureSymbol}</td>
            <td>
                <div className={styles.actions_block} >
                    <button onClick={() => callbacks.deleteIngredient(ingredient)} className={[styles.button, styles.red].join(' ')}>Удалить</button>

                </div>
            </td>
        </tr>
    );
};

export default RecipeIngredientRow;