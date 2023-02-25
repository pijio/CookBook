import {createStore, compose, applyMiddleware} from "redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const composeEnhancer = compose;

const store = createStore(rootReducer,
    composeEnhancer(applyMiddleware(thunk))
)

export default store