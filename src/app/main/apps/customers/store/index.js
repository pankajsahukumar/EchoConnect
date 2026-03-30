import { combineReducers } from '@reduxjs/toolkit';
import customers from './customersSlice';

const reducer = combineReducers({
  customers,
});

export default reducer;
