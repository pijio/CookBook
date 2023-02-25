const initialState = {
    ingredients: [],
}

const ingredientsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_INGREDIENTS':
            return {
                ...state,
                ingredients: action.payload
            }
        case 'UPDATE_INGREDIENTS':
            return {
                ...state,
                ingredients: action.payload
            }
        default:
            return state
    }
}


export default ingredientsReducer