import {combineReducers} from "redux";
import measures from './measures'
import ingredients from "./ingredients";
const rootReducer = combineReducers({
    measures,
    ingredients,
})
export default rootReducer