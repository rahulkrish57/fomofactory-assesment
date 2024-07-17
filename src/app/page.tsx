"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootReducer";
import { increment, decrement } from "./store/slices/coinSlice";
import { useAppDispatch } from "./store";

const Home = () => {
  const dispatch = useAppDispatch();
  const value = useSelector((state: RootState) => state.coin.value);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Value: {value}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <ul>
        <li>
          <Link href="/detail/1">Go to Detail Page with ID 1</Link>
        </li>
        <li>
          <Link href="/detail/2">Go to Detail Page with ID 2</Link>
        </li>
        <li>
          <Link href="/detail/3">Go to Detail Page with ID 3</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
