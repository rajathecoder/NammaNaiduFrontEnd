import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define the state interface
interface CounterState {
    value: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: CounterState = {
    value: 0,
    status: 'idle',
    error: null,
};

// Example async thunk
export const incrementAsync = createAsyncThunk(
    'counter/incrementAsync',
    async (amount: number) => {
        // Simulate an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return amount;
    }
);

// Create the slice
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        reset: (state) => {
            state.value = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(incrementAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(incrementAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.value += action.payload;
            })
            .addCase(incrementAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

// Export actions
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Export selectors
export const selectCount = (state: RootState) => state.counter.value;
export const selectCounterStatus = (state: RootState) => state.counter.status;
export const selectCounterError = (state: RootState) => state.counter.error;

// Export reducer
export default counterSlice.reducer;

