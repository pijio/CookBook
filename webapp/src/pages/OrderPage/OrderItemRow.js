import React, {useState} from 'react';
import styles from './Order.module.css'

const OrderItemRow = ({recipeItem, callbacks}) => {

    const [portions, setPortions] = useState(recipeItem.countOf)
    function increment() {
        setPortions(portions + 1)
        callbacks.changeCountOf(recipeItem.recipeId, true)
    }

    function decrement() {
        if(portions===1) return;
        setPortions(portions - 1)
        callbacks.changeCountOf(recipeItem.recipeId, false)
    }

    return (
        <tr key={recipeItem.recipeId}>
            <td>{recipeItem.recipeName}</td>
            <td>{portions}</td>
            <td>
                <div className={styles.actions_block} >
                    <button onClick={() => callbacks.deleteRecipe(recipeItem)} className={[styles.button, styles.red].join(' ')}>Удалить</button>
                    <button className={styles.inc} onClick={increment}>+</button>
                    <button className={styles.dec} onClick={decrement}>-</button>
                </div>
            </td>
        </tr>
    );
};

export default OrderItemRow;