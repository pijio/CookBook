import axios from "axios";

export const loadRecipes = (items)=>({
    type:'LOAD_RECIPES',
    payload : items
});

export const updateRecipesAction = (items)=>({
    type:'UPDATE_RECIPES',
    payload : items
});

export const fetchRecipes = () => async (dispatch) => {
    return (
        await axios.get(`https://localhost:5001/api/recipes/getRecipes`).then(({data}) => {
            dispatch(loadRecipes(data))
        }).catch(() => console.log('Не удалось получить ответ от API')));
}

export const updateMeasures = (recipes) => async (dispatch) => {
    return (
        dispatch(updateRecipesAction(recipes))
    )
}