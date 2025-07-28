import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";


const initialState = {
    currentUser : null ,
    error : null ,
    loading : false,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        loginStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess : (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
            toast.success("Login successful");
        },
        loginFailure : (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload || "Login failed");
        },
        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
            toast.success("Profile updated successfully");
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload || "Profile update failed");
        },

    },

})
export const { loginStart, loginSuccess, loginFailure ,updateUserStart , updateUserFailure , updateUserSuccess } = userSlice.actions;
export default userSlice.reducer;