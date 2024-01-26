import api from "../../api/api";
import { setMyData, setIsAuthenticated } from "./authSlice.js";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// get my profile
export const getMyProfileData = createAsyncThunk('getMyProfile', async (_, { rejectWithValue, dispatch }) => {

    try {
        const { data, status } = await api.get(`/profile/me`, {
            withCredentials: true
        });

        if (status >= 300) { return rejectWithValue(data) }
        dispatch(setMyData(data.user));
        dispatch(setIsAuthenticated(true));
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


// delete artwork
export const deleteAccount = createAsyncThunk('deleteAccount', async (userId, { rejectWithValue, dispatch }) => {
    try {
        const { data, status } = await api.delete(`/account/delete/${userId}`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        if (status >= 300) { return rejectWithValue(data) }
        dispatch(setMyData(null));
        dispatch(setIsAuthenticated(false));
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const createOrder = createAsyncThunk('createOrder', async (orderData, { rejectWithValue }) => {
    try {
        const { data, status } = await api.post('/order/new', { orderData }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


// get orders made
export const getOrdersMade = createAsyncThunk('getOrdersMade', async (_, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get('/orders/made', { withCredentials: true });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


// get orders received
export const getOrdersReceived = createAsyncThunk('getOrdersReceived', async (_, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get('/orders/received', { withCredentials: true });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


export const userSlice = createSlice({
    name: 'user',

    initialState: {
        order: {},
        orders: [],
        ordersMade: [],
        ordersReceived: [],
    },

    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        clearMessage: (state) => {
            state.message = null;
        }
    },

    extraReducers: (builder) => {
        // delete art
        builder.addCase(deleteAccount.pending, (state) => {
            state.isLoading = true;
        }).addCase(deleteAccount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
            state.isAuthenticated = false;
        }).addCase(deleteAccount.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })


        //createOrder
        builder.addCase(createOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(createOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.order = action.payload;
            state.message = action.payload.message;
        }).addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })


        //orders made
        builder.addCase(getOrdersMade.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrdersMade.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ordersMade = action.payload.ordersMade;
        }).addCase(getOrdersMade.rejected, (state) => {
            state.isLoading = false;
            state.ordersMade = [];
        })


        //orders received
        builder.addCase(getOrdersReceived.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrdersReceived.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ordersReceived = action.payload.ordersReceived;
        }).addCase(getOrdersReceived.rejected, (state) => {
            state.isLoading = false;
            state.ordersReceived = [];
        })
    }
})

// Action creators are generated for each case reducer function
export const { clearError, clearMessage } = userSlice.actions
export default userSlice.reducer