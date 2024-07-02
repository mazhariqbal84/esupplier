import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import { useSelector } from "react-redux";
const Loader = ({ position = "fixed", loading = "Loading...", bgwhite = 50 }) => {
  const [isDark] = useDarkMode();
  const { isAuth } = useSelector((state) => state.auth);
  // console.log(bgwhite);
  return (
    <div
      className={`${position} ${position === "absolute" ? "h-full" : "h-screen"
        } top-0 left-0 bg-white/${bgwhite} backdrop-filter backdrop-blur z-30 w-full flex flex-col justify-center items-center `}
    >
      <svg
        className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 ${isAuth ? "h-6 w-6" : "h-12 w-12"
          } `}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div className="mb-3">
        {loading}
        {/* <img src={isDark ? LogoWhite : Logo} alt="Logo" /> */}
      </div>
    </div>
  );
};

export default Loader;
