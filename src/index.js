import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import DungeonReducer from './reducers/dungeon';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  DungeonReducer,
  window.devToolsExtension && window.devToolsExtension()
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
