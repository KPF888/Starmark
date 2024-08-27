// store.js
import { configureStore } from '@reduxjs/toolkit';
import subDomainDataReducer from './subDomainDataSlice';
import userConfigDataReducer from './userConfigDataSlice'

const store = configureStore({
  reducer: {
    subDomainData: subDomainDataReducer,
    userConfigData: userConfigDataReducer
  },
});

export default store;
