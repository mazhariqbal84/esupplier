import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import JwtService from "@/store/services/jwt.service";
import CryptoJS from "crypto-js";
import { Outlet, useNavigate } from "react-router-dom";
import ApiService from "../../../store/services/api.service";
import axios from "axios";

const initialUsers = () => {
    const decrypted =
        window.localStorage.getItem("users") &&
        CryptoJS.AES.decrypt(
            window.localStorage.getItem("users"),
            "secretKey"
        ).toString(CryptoJS.enc.Utf8);
    return decrypted
        ? JSON.parse(decrypted)
        : [
            {
                email: "admin@admin.com",
                password: "123456",
            },
        ];
};
// save users in local storage

const initialIsAuth = () => {
    const item = window.localStorage.getItem("isAuth");
    return item ? JSON.parse(item) : false;
};

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        errorsList: null,
        users: {},
        isAuth: initialIsAuth(),
        roles: [],
        permissions: [],
        isAuthenticated: !!JwtService.getToken(),
    },
    reducers: {
        // handleRegister: (state, action) => {
        //     const { name, email, password, phoneInputWithCountrySelect } =
        //         action.payload;
        //     // console.log(
        //     //   "state data",
        //     //   name,
        //     //   email,
        //     //   password,
        //     //   phoneInputWithCountrySelect,
        //     //   state.users
        //     // );
        //     // const user = state.users.find((user) => user.email === email);
        //     // if (user) {
        //     //   toast.error("User already exists", {
        //     //     position: "top-right",
        //     //     autoClose: 1500,
        //     //     hideProgressBar: false,
        //     //     closeOnClick: true,
        //     //     pauseOnHover: true,
        //     //     draggable: true,
        //     //     progress: undefined,
        //     //     theme: "light",
        //     //   });
        //     // } else {
        //     state.users = {
        //         id: uuidv4(),
        //         name,
        //         email,
        //         password,
        //         phone: phoneInputWithCountrySelect,
        //     };
        //     //console.log("state data", state.users);
        //     const encryptUser = CryptoJS.AES.encrypt(
        //         JSON.stringify(state.users),
        //         "secretKey"
        //     ).toString();
        //     window.localStorage.setItem("users", encryptUser);
        //     // window.localStorage.setItem("users", JSON.stringify(state.users));
        //     //   toast.success("User registered successfully", {
        //     //     position: "top-right",
        //     //     autoClose: 1500,
        //     //     hideProgressBar: false,
        //     //     closeOnClick: true,
        //     //     pauseOnHover: true,
        //     //     draggable: true,
        //     //     progress: undefined,
        //     //     theme: "light",
        //     //   });
        //     // }
        // },

        handleLogin: (state, data) => {
            JwtService.saveToken(data?.payload?.token);
        },
        handleLogout: (state, action) => {
            console.log("handle logout");
            axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
            ApiService.setHeader();

            new Promise(function (resolve, reject) {
                axios
                    .get("api/auth/logout")
                    .then(function (result) {
                        dispatch(ON_LOADING(false));
                        if (result.data._metadata.outcomeCode === 200) {
                            toast.success("User logged out successfully", {
                                position: "top-right",
                            });
                            // Clear localStorage
                            window.localStorage.clear();

                            // Clear sessionStorage
                            window.sessionStorage.clear();
                            resolve()
                        } else {
                            dispatch(setAuthErrors(result.data.errors));
                            //console.log('esle ' + result.data.errors)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);

                        //console.log("Error: ", error);
                    });
            });
            JwtService.destroyToken();
        },

        setAuthErrors: (state, error) => {
            state.errorsList = error.payload;
        },
        removeAuthError: (state) => {
            state.errorsList = {};
        },
    },
});

export const {
    handleRegister,
    handleLogin,
    handleLogout,
    removeAuthError,
    setAuthErrors,
} = authSlice.actions;
export default authSlice.reducer;
