const initialState = {
    recipes: [],
}

const cookbookReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_RECIPES':
            return {
                ...state,
                recipes: action.payload
            }
        case 'UPDATE_RECIPES':
            return {
                ...state,
                recipes: action.payload
            }
        default:
            return state
    }
}

export default cookbookReducer