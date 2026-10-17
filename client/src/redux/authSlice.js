import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOKEN_KEY, getErrorMessage } from '../api/axiosClient';
import { authService } from '../services/authService';

const readToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        return await authService.getMe();
    } catch (err) {
        return rejectWithValue(getErrorMessage(err));
    }
});

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {
            const token = await authService.login(email, password);
            dispatch(tokenReceived(token));
            return await authService.getMe();
        } catch (err) {
            return rejectWithValue(getErrorMessage(err, 'Login failed'));
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            await authService.register(data);
        } catch (err) {
            return rejectWithValue(getErrorMessage(err, 'Registration failed'));
        }
        return dispatch(login({ email: data.email, password: data.password })).unwrap();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: readToken(),
        user: null,
        // 'idle' -> token present but user not loaded yet
        status: readToken() ? 'idle' : 'anonymous',
    },
    reducers: {
        tokenReceived: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.status = 'anonymous';
        },
        userUpdated: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'authenticated';
            })
            .addCase(fetchMe.rejected, (state) => {
                state.token = null;
                state.user = null;
                state.status = 'anonymous';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'authenticated';
            })
            .addCase(login.rejected, (state) => {
                state.token = null;
                state.status = 'anonymous';
            });
    },
});

export const { tokenReceived, logout, userUpdated } = authSlice.actions;
export default authSlice.reducer;
