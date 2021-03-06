import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Analytics from './App';
import reportWebVitals from './reportWebVitals';

// bring in our temba-components if they aren't already registered
var componentsExist = document.body.innerHTML.indexOf('temba-components') > -1;
if (!componentsExist) {

  import(('@greatnonprofits-nfp/temba-components')).then(() => {
    console.log('Loading temba components');
  });
}

// @ts-ignore
window.showAnalytics = (ele: HTMLElement, context: any) => {
  // @ts-ignore
  ReactDOM.render(<Analytics context={context}/>, ele);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
