import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// Import the types exported from our store.ts
import type { RootState, AppDispatch } from "../store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

