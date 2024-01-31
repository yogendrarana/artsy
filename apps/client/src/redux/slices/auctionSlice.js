import api from '../../api/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


// place bid
export const placeBid = createAsyncThunk('placeBid', async (bidData, { rejectWithValue }) => {
    try {
        const { data, status } = await api.post('/auction/bid', bidData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

// find highest bidder
export const findHighestBid = async (artId) => {
    try {
        const { data, status } = await api.get(`/art/auction/highest-bid?artId=${artId}`);
        if (status >= 300) throw new Error(data);
        return data;
    } catch (err) {
        return err.response.data;
    }
}


export const auctionSlice = createSlice({
    name: 'auction',

    initialState: {
        allBids: [],
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

        // place bid
        builder.addCase(placeBid.pending, (state) => {
            state.isLoading = true;
        }).addCase(placeBid.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        }).addCase(placeBid.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })
    }
})

export default auctionSlice.reducer
export const { clearError, clearMessage } = auctionSlice.actions;