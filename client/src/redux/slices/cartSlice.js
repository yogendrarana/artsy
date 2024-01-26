import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cart',

    initialState: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    },

    reducers: {
        addToCart: (state, action) => {
            const art = action.payload;
            const artExists = state.cartItems.find(item => item._id === art._id);
            if (artExists) return;
            state.cartItems.unshift(art);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        deleteFromCart: (state, action) => {
            const newCartItems = state.cartItems.filter(item => item._id !== action.payload._id);
            state.cartItems = newCartItems;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
    }
})

// Action creators are generated for each case reducer function
export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions

export default cartSlice.reducer