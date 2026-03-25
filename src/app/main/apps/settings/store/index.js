import { combineReducers } from '@reduxjs/toolkit';
import tags from './tagSlice';

const reducer = combineReducers({
  tags,
});

export default reducer;
