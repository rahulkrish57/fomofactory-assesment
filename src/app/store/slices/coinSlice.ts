import { createSlice } from '@reduxjs/toolkit';

interface CoinState {
  value: number;
}

const initialState: CoinState = {
  value: 0,
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = coinSlice.actions;
export default coinSlice.reducer;
