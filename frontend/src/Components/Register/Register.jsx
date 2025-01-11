import React, { useState } from "react";
import axios from "axios";
import { getMessageSuccess, getMessageError } from "../../Hooks/popUpMessage";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../baseUrl.js";
function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      fullName === "" ||
      userName === "" ||
      email === "" ||
      phoneNumber === "" ||
      password === ""
    ) {
      getMessageError("User All Fields Are Required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/v1/users/register`, data);
      setLoading(false);
      getMessageSuccess("user register successfully");
      navigate("/login", { replace: true });
      console.log(res);
      return;
    } catch (error) {
      setLoading(false);
      getMessageError(error.response.data.message);
      return;
    }
  };
  return (
    <div className="loginContainer flex flex-col gap-4 justify-center items-center h-screen ">
      <Toaster />
      <div className="flex flex-col gap-4 bg-slate-200 w-[90%] text-black md:w-[30%] rounded-2xl shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="login flex flex-col gap-4 px-4 py-2"
        >
          <h1 className="text-3xl text-center font-extrabold">Register</h1>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            className="bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10 "
            value={fullName}
            placeholder="Enter Your Full Name"
            onChange={(e) => {
              setFullName(e.target.value);
              setData({ ...data, fullName: e.target.value });
            }}
          />
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            className=" bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10"
            placeholder="Enter Your User Name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setData({ ...data, userName: e.target.value });
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className=" bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setData({ ...data, email: e.target.value });
            }}
          />
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="number"
            id="phoneNumber"
            className=" bg-slate-100 px-2 py-1 rounded-xl focus:outline-divider h-10"
            placeholder="Enter Your Phone Number"
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
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setData({ ...data, password: e.target.value });
            }}
          />
          {/* already have account */}
          <Link to="/login">
            <p className="text-left text-slate-500">Already have an account?</p>
          </Link>
          <button
            type="submit"
            className="bg-pink-600  text-white py-2 rounded-full w-full flex justify-center items-center"
          >
            <span className="mr-2">Login</span>
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
    </div>
  );
}

export default Register;
