/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Dispatcher from './core/Dispatcher';
import Router from './Router';
import Location from './core/Location';
import ActionTypes from './constants/ActionTypes';
import { addEventListener, removeEventListener } from './utils/DOMUtils';

const container = document.getElementById('app');
const context = {
    onSetTitle: value => document.title = value,
    onSetMeta: (name, content) => {
        // Remove and create a new <meta /> tag in order to make it work
        // with bookmarks in Safari
        let elements = document.getElementsByTagName('meta');
        [].slice.call(elements).forEach((element) => {
            if (element.getAttribute('name') === name) {
                element.parentNode.removeChild(element);
            }
        });
        let meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
};

function cleanUp() {
    let done = false;
    if (!done) {
        // Remove the pre-rendered CSS because it's no longer used
        // after the React app is launched
        const css = document.getElementById('css');
        if (css) {
            css.parentNode.removeChild(css);
            done = true;
        }
    }
}

function render(state) {
    Router.dispatch(state, (_, component) => {
        ReactDOM.render(component, container, () => {
            // Restore the scroll position if it was saved into the state
            if (state.scrollY !== undefined) {
                console.log('window.scrollTo', state.scrollX, state.scrollY);
                window.scrollTo(state.scrollX, state.scrollY);
            } else {
                //делаем возможной родной скролл браузера по якорям
                if (location.hash) {
                    console.log('window.scrollTo location.hash', location.hash);
                }
                else {
                    //для ручного скрола к определенному месту на странице
                    if (window.pageYScrollTo != null) {
                        console.log('window.scrollTo 0', window.pageYScrollTo);
                        window.scrollTo(0, window.pageYScrollTo);
                        window.pageYScrollTo = null;
                    }
                    else {
                        console.log('window.scrollTo 0 0');
                        window.scrollTo(0, 0);
                    }
                }
            }
            cleanUp();
        });
    });
}

function run() {
    let currentLocation = null;
    let currentState = null;

    // Make taps on links and buttons work fast on mobiles
    FastClick.attach(document.body);

    // Re-render the app when window.location changes
    const unlisten = Location.listen(location => {
        currentLocation = location;
        currentState = Object.assign({}, location.state, {
            path: location.pathname,
            query: location.query,
            state: location.state,
            context
        });
        render(currentState);
    });

    // Save the page scroll position into the current location's state
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
    const setPageOffset = () => {
        currentLocation.state = currentLocation.state || Object.create(null);
        currentLocation.state.scrollX = supportPageOffset ? window.pageXOffset : isCSS1Compat ?
            document.documentElement.scrollLeft : document.body.scrollLeft;
        currentLocation.state.scrollY = supportPageOffset ? window.pageYOffset : isCSS1Compat ?
            document.documentElement.scrollTop : document.body.scrollTop;
    };

    addEventListener(window, 'scroll', setPageOffset);
    addEventListener(window, 'pagehide', () => {
        removeEventListener(window, 'scroll', setPageOffset);
        unlisten();
    });
}

// Run the application when both DOM is ready
// and page content is loaded
if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
} else {
    window.attachEvent('onload', run);
}
