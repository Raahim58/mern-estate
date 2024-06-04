import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signinstart: (state) => {
            state.loading = true;
        },
        signinsuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signinfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { signinstart, signinsuccess, signinfailure } = userSlice.actions;

export default userSlice.reducer;
