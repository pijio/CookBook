const initialState = {
    measures: [],
}

const measuresReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_MEASURES':
            return {
                ...state,
                measures: action.payload
            }
        case 'UPDATE_MEASURES': {
            return {
                ...state,
                measures: action.payload
            }
        }
        default:
            return state
    }
}


export default measuresReducer