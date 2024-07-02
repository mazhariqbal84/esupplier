import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleLogin, removeAuthError, setAuthErrors } from "./store";
import ApiService from "@/store/services/api.service";
import { ON_LOADING } from "@/store/loader";
import Loader from "@/components/Loader";
import axios from "axios";
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),

    password: yup
      .string()
      .matches(/^\S*$/, "Spaces are not allowed")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const { isLoading } = useSelector((state) => state.loader);
  const VITE_SYSTEM_MODE = import.meta.env.VITE_SYSTEM_MODE;
  const dispatch = useDispatch();
  // console.log(errorsList);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    dispatch(removeAuthError());
    dispatch(ON_LOADING(true));

    let { email, password } = data;
    email = "gkuphal@example.org";
    password = "password";
    axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
    return new Promise(function (resolve, reject) {
      axios
        .post("api/auth/login", { email, password })
        .then(function (result) {
          dispatch(ON_LOADING(false));
          if (result.data._metadata.outcomeCode === 200) {
            toast.success("User logged in successfully");

            dispatch(handleLogin(result.data.records));
           
            setTimeout(() => {
              navigate("/dashboard");
            }, 1500);

            resolve(result);
          } else if (result.data?._metadata?.outcome === "PACKAGE_NOT_ACTIVE") {
            window.open("/package-expire", "_self");
          } else {
            dispatch(setAuthErrors(result.data.errors));
            //console.log('esle ' + result.data.errors)
          }
        })
        .catch(function (error) {
          dispatch(ON_LOADING(false));
          reject(error);
          dispatch(setAuthErrors(error));
          //console.log("Error: ", error);
        });
    });
  };

  const [checked, setChecked] = useState(false);

  return (
    <>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <Textinput
          name="email"
          label="email"
          type="email"
          placeholder="Enter Email "
          defaultValue={`${
            VITE_SYSTEM_MODE === "Demo" ? "oyf@account.com" : ""
          }`}
          register={register}
          error={errors.email}
        />
        <Textinput
          name="password"
          label="password"
          type="password"
          placeholder="Enter Password "
          // value={"Oyf.account.demo"}
          defaultValue={`${VITE_SYSTEM_MODE === "Demo" ? "12345678" : ""}`}
          register={register}
          error={errors.password}
        />
        {VITE_SYSTEM_MODE === "Live" && (
          <div className="flex justify-between">
            <Checkbox
              value={checked}
              onChange={() => setChecked(!checked)}
              label="Keep me signed in"
            />
            <Link
              to="/forgot-password"
              onClick={() => {
                dispatch(removeAuthError());
              }}
              className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
            >
              Forgot Password?{" "}
            </Link>
          </div>
        )}

        <button className="btn btn-dark block w-full text-center sign_in_portal_oyf">
          Sign in
        </button>
      </form>
    </>
  );
};

export default LoginForm;
