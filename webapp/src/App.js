import {BrowserRouter} from "react-router-dom";
import React from 'react'
import Navigation from "./components/Navigation/Navigation";
import Routes from "./components/Navigation/Routes";
import styles from './App.module.css'

function App() {
  return (
      <div className={styles.wrapper}>
          <BrowserRouter>
              <Navigation/>
              <div className={styles.content}>
                  <Routes/>
              </div>
          </BrowserRouter>
      </div>
  );
}

export default App;
