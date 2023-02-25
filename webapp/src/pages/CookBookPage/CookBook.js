import React, {useEffect, useState} from 'react';
import styles from './CookBook.module.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchRecipes} from "../../redux/actions/cookbook";
import Recipe from "./Recipe";
import Modal from "../../components/UI/Modal/Modal";
import RecipeForm from "./RecipeForm";

const CookBook = () => {
    const dispatcher = useDispatch();
    const items = useSelector(({cookbook}) => cookbook.recipes)
    useEffect(() => {
        dispatcher(fetchRecipes())
    },[])

    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        setRecipes(items);
    }, [items]);
    const [addModal, setAddModal] = useState(false)
    function addRecipe(recipe) {
        const newItems = [...recipes, recipe]
        setRecipes(newItems)
        setAddModal(false)
    }

    function removeRecipe(deletedRecipe) {
        const newItems = recipes.filter(item => item.recipeName !== deletedRecipe.recipeName)
        setRecipes(newItems)
    }

    return (
        <div className={styles.cookbook}>
            <h1>Книга рецептов</h1>
            <button onClick={() => setAddModal(true)} className={[styles.button, styles.default].join(' ')}>Добавить рецепт</button>
            <Modal visible={addModal} setVisible={setAddModal}>
                <RecipeForm isUpdate={false} callBack={addRecipe}>

                </RecipeForm>
            </Modal>
            {recipes.length === 0 ? (<div><h3>Тут пусто...</h3><h4>Нажмите кнопку "Добавить рецепт"</h4></div>) : recipes.map((recipe) => (
                <Recipe key={recipe.id} recipe={recipe} removeCallback={removeRecipe}></Recipe>
            ))}
        </div>
    );
};

export default CookBook;