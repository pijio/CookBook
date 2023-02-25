import {combineReducers} from "redux";
import measures from './measures'
import ingredients from "./ingredients";
import cookbook from "./cookbook";
const rootReducer = combineReducers({
    measures,
    ingredients,
    cookbook
})
export default rootReducer