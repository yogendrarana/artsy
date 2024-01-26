import { configureStore } from "@reduxjs/toolkit"

// Import Reducers
import artReducer from '../slices/artSlice'
import userReducer from '../slices/userSlice'
import authReducer from '../slices/authSlice'
import cartReducer from '../slices/cartSlice'
import likeReducer from '../slices/likeSlice'
import chatReducer from '../slices/chatSlice'
import adminReducer from '../slices/adminSlice'
import auctionReducer from '../slices/auctionSlice'
import profileReducer from '../slices/profileSlice'

const store = configureStore({
    reducer: {
        art: artReducer,
        auth: authReducer,
        user: userReducer,
        cart: cartReducer,
        like: likeReducer,
        chat: chatReducer,
        admin: adminReducer,
        profile: profileReducer,
        auction: auctionReducer,
    },
    devTools: true
})

export default store;