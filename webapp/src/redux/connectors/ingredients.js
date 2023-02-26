import { connect } from 'react-redux';
import Ingredients from "../../pages/IngredientsPage/Ingredients";

const ingredients = state => {
    return {
        myArray: state.ingredients
    };
};

export default connect(ingredients)(Ingredients);