import { createSlice } from '@reduxjs/toolkit';


export const likeSlice = createSlice({
    name: 'like',

    initialState: {
        likedArts: localStorage.getItem('likedArts') ? JSON.parse(localStorage.getItem('likedArts')) : [],
    },

    reducers: {
        addToLikes: (state, action) => {
            const art = action.payload;
            const artExists = state.likedArts.find(item => item._id === art._id);
            if (artExists) return;
            state.likedArts.unshift(art);    
            localStorage.setItem('likedArts', JSON.stringify(state.likedArts));
        },

        deleteFromLikes: (state, action) => {
            const art = action.payload;
            const newLikedArts = state.likedArts.filter(item => item._id !== art._id);
            state.likedArts = newLikedArts;
            localStorage.setItem('likedArts', JSON.stringify(state.likedArts));
        },

        clearLikes: (state) => {
            state.likedArts = [];
            localStorage.setItem('likedArts', JSON.stringify(state.likedArts));
        },
    },
});

export const { clearError, clearMessage, addToLikes, clearLikes, deleteFromLikes } = likeSlice.actions;
export default likeSlice.reducer;