import { createSlice } from '@reduxjs/toolkit';

const dimensionSlice = createSlice({
    name: 'dimension',
    initialState: { dimension: [], isSelected: [], isNumeric: [] },
    reducers: {
        addDimension: function (state, value) {
            return state = {
                ...state,
                dimension: value.payload.dimension,
                isSelected: value.payload.isSelected,
                isNumeric: value.payload.isNumeric
            };
        },
        changeValue(state, obj) {
            let isSelected = [...state.isSelected];
            isSelected[obj.payload.id] = obj.payload.checked
            return state = {
                ...state,
                isSelected
            };
        }
    }
});

export const dimActions = dimensionSlice.actions;

export default dimensionSlice;