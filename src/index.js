import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppFactory from './App';
import * as serviceWorker from './serviceWorker';
import Db from './db';
import Engine from './engine';
const fakeEngine = {
    getQuestion: () => [3, 2]
};
const db = Db(indexedDB);
const App = AppFactory(Engine(Math.random), db);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
