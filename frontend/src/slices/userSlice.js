import { createSlice } from "@reduxjs/toolkit";
const savedUser = JSON.parse(localStorage.getItem("user"));


const initialState = savedUser || {
    name:"",
    email:"",
    isloggedin:false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state,action) {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isloggedin = true;
        },
        logout(state){
            state.name = "",
            state.email = "",
            state.isloggedin = false;
        },
    },
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;