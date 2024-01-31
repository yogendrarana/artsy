import api from "../../api/api";
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'

// register user
export const registerUser = createAsyncThunk('registerUser', async (registerData, { rejectWithValue }) => {
    try {
        const { data, status } = await api.post('/register', registerData, {
            withCredentials: true, //this line is must for cookies to be sent and set
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


// login user
export const loginUser = createAsyncThunk('loginUser', async (loginData, { rejectWithValue }) => {
    try {
        const { data, status } = await api.post('/login', loginData, {
            withCredentials: true, //this line is must for cookies to be sent and set
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


// logout user
export const logoutUser = createAsyncThunk('logoutUser', async (_, { rejectWithValue }) => {
    try {
        const { data, status } = await api.get('/logout', { withCredentials: true });
        if (status >= 300) { return rejectWithValue(data) }
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const authSlice = createSlice({
    name: 'auth',

    initialState: {
        myData: null,
        isAuthenticated: false,
    },

    reducers: {
        setMyData: (state, action) => {
            state.myData = action.payload;
        },

        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },

        clearError: (state) => {
            state.error = null;
        },

        clearMessage: (state) => {
            state.message = null;
        }
    },

    extraReducers: (builder) => {

        // logout user
        builder.addCase(logoutUser.pending, (state) => {
            state.isLoading = true;
            state.isAuthenticated = true;
        }).addCase(logoutUser.fulfilled, (state) => {
            state.myData = null;
            state.isLoading = false;
            state.isAuthenticated = false;
            state.accessToken = null;
        }).addCase(logoutUser.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = true;
        })


        // register user, login user
        builder.addMatcher(isAnyOf(registerUser.pending, loginUser.pending), (state) => {
            state.isLoading = true;
            state.isAuthenticated = false;
        }).addMatcher(isAnyOf(registerUser.fulfilled, loginUser.fulfilled), (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.message = action.payload.message;
            state.myData = action.payload.user;
        }).addMatcher(isAnyOf(registerUser.rejected, loginUser.rejected), (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.error = action.payload.message;
        })
    }
})

// Action creators are generated for each case reducer function
export const { setMyData, setIsAuthenticated, clearError, clearMessage, setCredentials } = authSlice.actions

export default authSlice.reducer