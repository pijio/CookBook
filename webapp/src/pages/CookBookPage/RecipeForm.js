import React, {useState} from 'react';
import styles from "../IngredientsPage/Ingredients.module.css";

const RecipeForm = ({recipe, isUpdate, callBack}) => {

    const formObj = (isUpdate) ? {
        recipeName: recipe.recipeName,
        recipeComment: recipe.recipeComment,
        ingredients: recipe.ingredients
    } : {recipeName: 'Бисквит', recipeComment: '...', ingredients: []}
    const [obj, setObj] = useState(formObj)

    return (
        <div className={styles.form}>
            <div className={styles.footer}>
                <div>
                    <input id="price" className={styles.input} type="text"
                           value={obj.recipeName}
                           onChange={(event) => setObj({...obj, recipeName: event.target.value})}
                           placeholder={obj.countOf}/>
                    <div className="cut"></div>
                    <label htmlFor="price">Наименование блюда</label>
                </div>
                <div>
                    <input id="price" className={styles.input} type="textarea"
                           value={obj.recipeComment}
                           onChange={(event) => setObj({...obj, recipeComment: event.target.value})}
                           placeholder='...'/>
                    <div className="cut"></div>
                    <label htmlFor="price">Комментарии по приготовлению</label>
                </div>
                <button type="text" onClick={() => callBack(obj)} className={styles.submit}>Submit</button>
            </div>
        </div>
    );
};

export default RecipeForm;