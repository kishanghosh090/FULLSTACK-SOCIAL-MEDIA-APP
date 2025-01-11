import React, { useState } from "react";
import BackNavigation from "../BackNavigationBar/BackNavigation";
import axios from "axios";
import { getMessageSuccess, getMessageError } from "../../Hooks/popUpMessage";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {baseUrl} from "../../../baseUrl.js";

function ForgetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [dataGetOTP, setDataGetOTP] = useState({
    email: "",
  });

  const [emailForVerify, setEmailForVerify] = useState("");
  const [dataForVerify, setDataForVerify] = useState({
    email: "",
    OTP: "",
  });

  const getOTP = (e) => {
    e.preventDefault();
    if (!email) {
      getMessageError("Email is required");
      return;
    }
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/users/forgetPasswordOTPSend`, dataGetOTP)
      .then((res) => {
        console.log(res);
        getMessageSuccess("OTP sent successfully");
        setLoading(false);
        setIsOpen(true);
        setEmailForVerify(email);
        setEmail("");
      })
      .catch((err) => {
        setLoading(false);
        getMessageError(err.response.data.message);
        return;
      });
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (!otp) {
      getMessageError("OTP is required");
      return;
    }
    axios
      .post(`${baseUrl}/api/v1/users/forgetPasswordOTPVerify`, dataForVerify)
      .then((res) => {
        console.log(res);
        getMessageSuccess("OTP verified successfully");
        navigate("/", { replace: true });
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Toaster />
      <BackNavigation forgetPassword="Forget Password" />
      <div className="mt-[4rem] px-3">
        <div className="form mt-3 pt-7">
          <form onSubmit={getOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDataGetOTP({ ...dataGetOTP, email: e.target.value });
                }}
                required
              />
            </div>
            <div className="mb-6">
              <button
                className="w-full bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                type="submit"
              >
                <span className="mr-2">Send Reset Link</span>
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
            </div>
          </form>
        </div>
      </div>
      {isOpen && (
        <div className=" bg-slate-200 px-3 py-2 mx-3 w-auto">
          <h1 className="text-slate-600">
            OTP is sent to your email <span>{emailForVerify}</span>
          </h1>
          <div className="mt-9  h-[50vh] z-50 text-black">
            <form onSubmit={verifyOTP} className="flex flex-col gap-2">
              <label htmlFor="otp">Enter OTP</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="otp"
                type="text"
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setDataForVerify({
                    ...dataForVerify,
                    email: emailForVerify,
                    OTP: e.target.value,
                  });
                }}
              />
              <button
                className="w-full bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
                type="submit"
              >
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
