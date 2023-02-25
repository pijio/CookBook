import axios from "axios";

export const loadMeasures = (items)=>({
    type:'LOAD_MEASURES',
    payload : items
});

export const updateMeasureAction = (items)=>({
    type:'UPDATE_MEASURES',
    payload : items
});

export const fetchMeasures = () => async (dispatch) => {
    return (
        await axios.get(`https://localhost:5001/api/measures/getMeasures`).then(({data}) => {
            dispatch(loadMeasures(data))
        }).catch(() => console.log('Не удалось получить ответ от API')));
}

export const updateMeasures = (measures) => async (dispatch) => {
    return (
            dispatch(updateMeasureAction(measures))
    )
}