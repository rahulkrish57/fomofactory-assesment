import { combineReducers } from "@reduxjs/toolkit";
import coinReducer from "./slices/coinSlice";

const rootReducer = combineReducers({
  coin: coinReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
