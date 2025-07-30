import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import myListingReducer from "./myListingSlice.js"; // ✅ Import your listing reducer
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// ✅ Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  myListing: myListingReducer, // ✅ Add here
});

// ✅ Persist config with blacklist
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["myListing"], // ✅ Exclude this from persistence
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
