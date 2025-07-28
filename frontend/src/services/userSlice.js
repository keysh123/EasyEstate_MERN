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
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            toast.success("Account deleted successfully");
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload || "Account deletion failed");
        },
        logoutUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        logoutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            toast.success("Logged out successfully");
        },
        logoutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload || "Logout failed");
        },

    },

})
export const { loginStart, loginSuccess, loginFailure ,updateUserStart , updateUserFailure , updateUserSuccess ,deleteUserFailure , deleteUserStart , deleteUserSuccess , logoutUserFailure , logoutUserStart , logoutUserSuccess} = userSlice.actions;
export default userSlice.reducer;