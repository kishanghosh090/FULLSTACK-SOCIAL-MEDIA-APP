import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { getMessageSuccess, getMessageError } from "../../Hooks/popUpMessage";
import { Toaster } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" && phoneNumber === "") {
      getMessageError("Email or phone Number is required");
      return;
    }
    if (password === "") {
      getMessageError("Password is required");
      return;
    }
    setLoading(true);
    axios
      .post(
        "/api/v1/users/login",
        data
      )
      .then((res) => {
        setLoading(false);
        getMessageSuccess("user login successfully");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        navigate("/", { replace: true });
        console.log(res);
        return;
      })
      .catch((err) => {
        setLoading(false);
        getMessageError(err.response.data.message);
        return;
      });
  };
  return (
    <div className="loginContainer flex flex-col gap-4 justify-center items-center h-screen ">
      <Toaster />
      <div className="loginForm flex flex-col gap-4 bg-slate-200 w-[90%] text-black md:w-[30%] rounded-2xl shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="login flex flex-col gap-4 px-4 py-2"
        >
          <h1 className="text-3xl text-center font-extrabold bg-slate-100 py-2">
            Login
          </h1>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className=" bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setData({ ...data, email: e.target.value });
            }}
          />
          <h2 className="text-center ">Or</h2>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="number"
            id="phoneNumber"
            className=" bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10"
            placeholder="Enter your Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setData({ ...data, phoneNumber: e.target.value });
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className=" bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setData({ ...data, password: e.target.value });
            }}
          />

          {/* forget password ? */}
          <Link to="/ForgetPassword" className="text-pink-500 text-sm">
            Forget Password ?
          </Link>
          <button
            type="submit"
            className="bg-pink-600  text-white py-2 rounded-full w-full flex justify-center items-center"
          >
            <span className="mr-2">Login </span>
            <span>
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </span>
          </button>
        </form>
      </div>
      <div className="flex justify-center items-center gap-4 w-[90%] mx-auto">
        <NavLink
          to="/Register"
          className="text-slate-600 w-full md:w-[30%] border border-gray-600 px-4 py-2 rounded-full flex justify-center items-center"
        >
          Create an account
        </NavLink>
      </div>
    </div>
  );
}

export default Login;
