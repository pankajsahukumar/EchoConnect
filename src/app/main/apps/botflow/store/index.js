import { combineReducers } from '@reduxjs/toolkit';
import bot from './botSlice';

const reducer = combineReducers({bot});

export default reducer;
