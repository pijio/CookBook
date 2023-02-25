import axios from "axios";

export const loadIngredients = (items)=>({
    type:'LOAD_INGREDIENTS',
    payload : items
});

export const fetchIngredients = () => async (dispatch) => {
    return (
        await axios.get(`https://localhost:5001/api/ingredients/getIngredients`).then(({data}) => {
            dispatch(loadIngredients(data))
        }).catch(() => console.log('Не удалось получить ответ от API')));
}
