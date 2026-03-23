import { combineReducers } from '@reduxjs/toolkit';
import templates from './templateSlice';
import templateForm from './templateFormSlice';

const reducer = combineReducers({
    templates,
    templateForm,
});

export default reducer;
