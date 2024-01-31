import api from "../../api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// upload art
export const uploadArt = createAsyncThunk('uploadArt', async (productData, { rejectWithValue }) => {
    try {
        const { data, status } = await api.post('/art/upload', productData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


// get arts
export const getAllArts = createAsyncThunk('getAllArts', async ({ keyword = '', category = '', maxPrice = Number(50000), minPrice = Number(0), sortByPrice = '' }, { rejectWithValue }) => {
    const link = `/arts?keyword=${keyword}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortByPrice=${sortByPrice}`
    try {
        const { data, status } = await api.get(link);
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


// get specific art
export const readArtwork = createAsyncThunk('readArtwork', async (id, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get(`/art/${id}`);
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


// delete artwork
export const deleteArt = createAsyncThunk('deleteArt', async (artId, { rejectWithValue }) => {
    try {
        const { data, status } = await api.delete(`/art/delete/${artId}`, { withCredentials: true });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


// create review 
export const createReview = createAsyncThunk('createReview', async (reviewData, { rejectWithValue }) => {
    const { id } = reviewData;
    try {
        const { data, status } = await api.post(`/art/${id}/reviews`, reviewData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        rejectWithValue(err.response.data);
    }
})


// get reviews
export const getReviews = createAsyncThunk('getReviews', async (id, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get(`/art/${id}/reviews`);
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


// updateOrder thunk
export const updateArtwork = createAsyncThunk('updateArtwork', async (artData, { rejectWithValue }) => {
    const { artId, name, price, category, discount, description } = artData;
    try {
        const { data, status } = await api.put(`/art/update/${artId}`, { name, price, category, discount, description }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})


// get recommendations
export const getRecommendations = createAsyncThunk('getRecommendations', async (_, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get('/art/recommendations');
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


export const artSlice = createSlice({
    name: 'art',

    initialState: {
        artwork: {},
        allArts: [],
        reviews: [],
        newArrivals: [],
        highestRated: [],
        specialOffers: [],
    },

    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        clearMessage: (state) => {
            state.message = null;
        },
    },

    extraReducers: (builder) => {

        // upload product
        builder.addCase(uploadArt.pending, (state) => {
            state.isLoading = true;
        }).addCase(uploadArt.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        }).addCase(uploadArt.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })

        // get arts
        builder.addCase(getAllArts.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllArts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allArts = action.payload.arts;
        }).addCase(getAllArts.rejected, (state) => {
            state.isLoading = false;
            state.allArts = [];
        })

        // get specific art
        builder.addCase(readArtwork.pending, (state) => {
            state.isLoading = true;
        }).addCase(readArtwork.fulfilled, (state, action) => {
            state.isLoading = false;
            state.artwork = action.payload.artwork;
        }).addCase(readArtwork.rejected, (state) => {
            state.isLoading = false;
            state.artwork = {};
        })


        // delete art
        builder.addCase(deleteArt.pending, (state) => {
            state.isLoading = true;
        }).addCase(deleteArt.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        }).addCase(deleteArt.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })


        // delete art
        builder.addCase(updateArtwork.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateArtwork.fulfilled, (state) => {
            state.isLoading = false;
        }).addCase(updateArtwork.rejected, (state) => {
            state.isLoading = false;
        })

        // create review
        builder.addCase(createReview.pending, (state) => {
            state.isLoading = true;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        }).addCase(createReview.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        })

        // get reviews
        builder.addCase(getReviews.pending, (state) => {
            state.isLoading = true;
        }).addCase(getReviews.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews = action.payload.reviews;
        }).addCase(getReviews.rejected, (state) => {
            state.isLoading = false;
            state.reviews = [];
        })

        // get recommendations
        builder.addCase(getRecommendations.pending, (state) => {
            state.isLoading = true;
        }).addCase(getRecommendations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newArrivals = action.payload.newArrivals;
            state.highestRated = action.payload.highestRated;
            state.specialOffers = action.payload.specialOffers;
        }).addCase(getRecommendations.rejected, (state) => {
            state.isLoading = false;
            state.newArrivals = [];
            state.highestRated = [];
            state.specialOffers = [];
        })
    }
});

export const { clearError, clearMessage } = artSlice.actions;
export default artSlice.reducer;