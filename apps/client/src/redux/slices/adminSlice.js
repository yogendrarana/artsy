import api from '../../api/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

//getAllUsers thunk
export const getUsers = createAsyncThunk('getUsers', async ({ keyword = '' }, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get(`/admin/users?keyword=${keyword}`, {
            withCredentials: true
        });
        if (status >= 300) {
            return rejectWithValue(data)
        }
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// deleteUser
export const deleteUser = createAsyncThunk('deleteUser', async (userId, { rejectWithValue }) => {
    try {
        const { data, status } = await api.delete(`/admin/user/delete/${userId}`, {
            withCredentials: true
        });
        if (status >= 300) {
            return rejectWithValue(data)
        }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

//getAllOrders thunk
export const getAllOrders = createAsyncThunk('admin/getAllOrders', async (_, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get('/admin/orders', {
            withCredentials: true
        });
        if (status >= 300) {
            return rejectWithValue(data)
        }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


//updateOrder thunk
export const updateOrder = createAsyncThunk('admin/updateOrder', async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
        const { data, status } = await api.put(`/admin/order/${orderId}`, { orderStatus }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        if (status >= 300) {
            return rejectWithValue(data)
        }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


//deleteOrder thunk
export const deleteOrder = createAsyncThunk('admin/deleteOrder', async (orderId, { rejectWithValue }) => {
    try {
        const { data, status } = await api.delete(`/admin/order/${orderId}`, {
            withCredentials: true
        });
        if (status >= 300) {
            return rejectWithValue(data)
        }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// getStats thunk
export const getStats = createAsyncThunk('admin/getStats', async (_, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get('/admin/stats', {
            withCredentials: true
        });
        if (status >= 300) {
            return rejectWithValue(data)
        }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

const adminSlice = createSlice({
    name: 'admin',

    initialState: {
        allUsers: [],
        allOrders: [],
        stats: {}
    },

    reducers: {
        clearMessage: (state) => {
            state.message = null;
        },

        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        // get allUsers
        builder.addCase(getUsers.pending, (state) => {
            state.isLoading = true;
        }).addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allUsers = action.payload.users;
        }).addCase(getUsers.rejected, (state) => {
            state.isLoading = false;
            state.allUsers = [];
        })

        // update order
        builder.addCase(updateOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateOrder.fulfilled, (state) => {
            state.isLoading = false;
        }).addCase(updateOrder.rejected, (state) => {
            state.isLoading = false;
        })

        // get allUsers
        builder.addCase(getAllOrders.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allOrders = action.payload.orders;
        }).addCase(getAllOrders.rejected, (state) => {
            state.isLoading = false;
            state.allOrders = [];
        })

        // getStats
        builder.addCase(getStats.pending, (state) => {
            state.isLoading = true;
        }).addCase(getStats.fulfilled, (state, action) => {
            state.isLoading = false;
            state.stats = action.payload;
        }).addCase(getStats.rejected, (state) => {
            state.isLoading = false;
            state.stats = {}
        })

        // deleteUser
        builder.addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        }).addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })
    }
})

export default adminSlice.reducer
export const { clearError, clearMessage } = adminSlice.actions;