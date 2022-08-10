import dataSlice from './Data';
import dimensionSlice from './Dimension';
import { configureStore } from '@reduxjs/toolkit';
import formSlice from './FormSlice';

const store = configureStore({
    reducer: {
        dim: dimensionSlice.reducer,
        data: dataSlice.reducer,
        form: formSlice.reducer
    }
});

export default store;