import React, {useState} from 'react';
import styles from './Ingredients.module.css'
import Modal from "../../components/UI/Modal/Modal";
import IngredientsForm from "./IngredientsForm";

const IngredientsRow = ({ingredient, callbacks}) => {
    const [editModalState, setEditModalState] = useState(false)
    const edit = callbacks.editIngredient;
    callbacks.editIngredient = (measure) => {
        edit(measure);
        setEditModalState(false);
    }
    return (
        <tr key={ingredient.id}>
            <td>{ingredient.name}</td>
            <td>{ingredient.price+' сом'}</td>
            <td>{ingredient.measureName}</td>
            <td>
                <div className={styles.actions_block} >
                    <button onClick={() => callbacks.deleteIngredient(ingredient)} className={[styles.button, styles.red].join(' ')}>Удалить</button>
                    <button onClick={() => setEditModalState(true)} className={[styles.button, styles.default].join(' ')}>Изменить</button>
                    <Modal visible={editModalState} setVisible={setEditModalState}>
                        <IngredientsForm forUpdateFlag={true} callback={callbacks.editIngredient} ingredient={ingredient}>

                        </IngredientsForm>
                    </Modal>
                </div>
            </td>
        </tr>
    );
};

export default IngredientsRow;