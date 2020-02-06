//import {chkLink} from './linkChecker.js';
//import 'babel-polyfill';
//import 'regenerator-runtime/runtime';
//import 'core-js/modules/es6.promise';
const regeneratorRuntime = require("regenerator-runtime");
const chkLink = require('./linkChecker');
test('Function chkLink should be defined', async() => {
        expect(chkLink).toBeDefined();
    });
