import React from 'react';
import {Route, Switch} from "react-router-dom";
import Home from "../../pages/HomePage/Home";
import Measures from "../../pages/MeasuresPage/Measures";
import Ingredients from "../../pages/IngredientsPage/Ingredients";
import CookBook from "../../pages/CookBookPage/CookBook";

const Routes = () => {
    return (
        <Switch>
            <Route path="/measures" component={Measures}/>
            <Route path="/cookbook" component={CookBook}/>
            <Route path="/ingredients" component={Ingredients}/>
            <Route path="/" component={Home}/>
        </Switch>
    );
};

export default Routes;