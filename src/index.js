import React from 'react';
import ReactDOM from 'react-dom';
import {AppProvider} from "@shopify/polaris";
import en from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/build/esm/styles.css";
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <AppProvider i18n={en} theme={{colorScheme: "light"}} >
    <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);