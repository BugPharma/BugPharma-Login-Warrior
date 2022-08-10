import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: 'data',
    initialState: { data: [] },
    reducers: {
        addData(state, value) {
            return state = {
                ...state,
                data: value.payload
            }
        },
    }
});

export const dataActions = dataSlice.actions;

export default dataSlice;