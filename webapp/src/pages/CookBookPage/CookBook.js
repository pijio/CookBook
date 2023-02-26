import React, {useEffect, useState} from 'react';
import styles from './CookBook.module.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchRecipes} from "../../redux/actions/cookbook";
import Recipe from "./Recipe";
import Modal from "../../components/UI/Modal/Modal";
import RecipeForm from "./RecipeForm";
import axios from "axios";

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
    async function addRecipe(recipe) {
        const result = await addRecipeRequest(recipe)
        recipe.id = result;
        const newItems = [...recipes, recipe]
        setRecipes(newItems)
        setAddModal(false)
    }

    function removeRecipe(deletedRecipe) {
        const newItems = recipes.filter(item => item.recipeName !== deletedRecipe.recipeName)
        deleteRecipeRequest(deletedRecipe)
        setRecipes(newItems)
    }

    const addRecipeRequest = async (recipe) => {
        const data = {
            recipeName: recipe.recipeName,
            recipeComment: recipe.recipeComment,
        };

        try {
            await axios.post(`https://localhost:5001/api/recipes/addRecipe`, data);
            const result = await axios.post('https://localhost:5001/api/recipes/getRecipeId', data);
            return result.data;
        } catch (error) {
            console.log(error);
            throw new Error('Не удалось получить ответ от API');
        }
    }

    const deleteRecipeRequest = async (recipe) => {
        await axios.post(`https://localhost:5001/api/recipes/deleteRecipe`, recipe).then(() => {
        }).catch(() => console.log('Не удалось получить ответ от API'));
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