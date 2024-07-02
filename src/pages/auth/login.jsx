import React, { useEffect } from "react";
import LoginForm from "./common/login-form";
import { ToastContainer } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import JwtService from "@/store/services/jwt.service";
const login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (JwtService.getToken() != null) {
      navigate("/dashboard");
    }
  }, [navigate]);
  const getYear = () => {
    return new Date().getFullYear();
  };
  // console.log(VITE_SYSTEM_MODE);
  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-slate-500 text-base">
                    Sign in to your account to start using OYF
                  </div>
                </div>
                <LoginForm />
              </div>
              <div className="auth-footer text-center">
                Copyright {getYear()}, E-supplier All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
