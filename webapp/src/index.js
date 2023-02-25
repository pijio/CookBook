import React from 'react';
import ReactDOM from 'react-dom/client';
import store from "./redux/store";
import App from './App';
import {Provider} from "react-redux";

const root = document.getElementById('root');

if (root) {
    const rootElement = ReactDOM.createRoot(root);
    rootElement.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}
