import { createSlice } from '@reduxjs/toolkit';


// 用户配置页数据
const userConfigDataSlice = createSlice({
  name: 'userConfigData',
  initialState: {
    fofaUri: 'https://fofa.info',
    fofaApiKey: '',
  },
  reducers: {
    setFoFaUri: (state, action) => {
      state.fofaUri = action.payload;
    },
    setFoFaApiKey: (state, action) => {
      state.fofaApiKey = action.payload;
    },
    initFofaConfig: (state, action) => {
      // 整体修改state的值
      Object.assign(state, action.payload);
    }
  },
});

export const { setFoFaApiKey, setFoFaUri, initFofaConfig } = userConfigDataSlice.actions;
export default userConfigDataSlice.reducer;
