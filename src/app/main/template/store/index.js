import { combineReducers } from '@reduxjs/toolkit';
import templateForm from './templateFormSlice';
import templates from './templateSlice';

const reducer = combineReducers({
    templateForm,
    templates,
});

export default reducer;
