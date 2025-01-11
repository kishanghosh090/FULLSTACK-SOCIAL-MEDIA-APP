import React, { useState } from "react";
import BackNavigation from "../BackNavigationBar/BackNavigation";
import defaultAvatar from "../../../public/default-avatar.jpg";
import { getMessageError, getMessageSuccess } from "../../Hooks/popUpMessage";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import {baseUrl} from "../../../baseUrl.js";

function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [updateImage, setUpdateImage] = useState({
    image: null,
  });
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [userNameData, setUserNameData] = useState({
    userName: "",
  });
  const [fullNameData, setFullNameData] = useState({
    fullName: "",
  });
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/`)
      .then((res) => {
        console.log("====================================");
        console.log("executed");
        console.log("====================================");
        getMessageSuccess(res.data.message);
        setImage(res.data.data.avatar);
        setUserName(res.data.data.userName);
        setFullName(res.data.data.fullName);
        console.log(res.data.data.avatar);
      })
      .catch((err) => {
        window.location.href = "/Login";
        console.log(err);

        getMessageError(err?.response?.data.message);
      });
  }, []);

  const updateAvatar = async (e) => {
    e.preventDefault();
    if (!updateImage.image) {
      getMessageError("Please select Your New Avatar");
      return;
    }

    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/users/editProfilePic`, updateImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        getMessageSuccess("Avatar updated successfully");
        setLoading(false);
        return;
      })
      .catch((err) => {
        setLoading(false);
        getMessageError(err.response.data.message);
        return;
      });
  };
  const changeUserName = async (e) => {
    e.preventDefault();
    if (userNameData.userName === "") {
      getMessageError("New User Name is required");
      return;
    }
    axios
      .post(`${baseUrl}/api/v1/users/editUserName`, userNameData)
      .then((res) => {
        getMessageSuccess(res.data.message);
        return;
      })
      .catch((err) => {
        getMessageError(err.response.data.message);
        return;
      });
  };
  const changeFullName = async (e) => {
    e.preventDefault();
    if (fullNameData.fullName === "") {
      getMessageError("New Full Name is required");
      return;
    }
    axios
      .post(`${baseUrl}/api/v1/users/editFullName`, fullNameData)
      .then((res) => {
        getMessageSuccess(res.data.message);
        return;
      })
      .catch((err) => {
        getMessageError(err.response.data.message);
        return;
      });
  };
  return (
    <div>
      <Toaster />
      <BackNavigation Edit="Edit Profile" />
      {loading && (
        <span className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            className="animate-spin h-10 w-10 text-current text-pink-700"
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
        </span>
      )}
      <div className="py-[6rem] px-4 ">
        <div className="updateProfilePic flex   flex-col border-b-2 py-2 justify-center items-center">
          <form onSubmit={updateAvatar}>
            <img
              src={image ? `${image}` : defaultAvatar}
              alt=""
              className="h-[270px] rounded-2xl w-[250px] border object-cover "
            />

            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              htmlFor="small_size"
            >
              Choose Photo
            </label>
            <input
              className="block w-50% mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 p-1"
              type="file"
              accept="image/*"
              name="image"
              id="image"
              onChange={(e) => {
                setUpdateImage({ ...updateImage, image: e.target.files[0] });
                setImage(e.target.files[0]);
              }}
            />
            <button
              type="submit"
              className="bg-purple-500 w-[100%] m-auto text-white text-xl rounded-full py-2 hover:bg-purple-600 md:w-[30%]"
            >
              Update
            </button>
          </form>
        </div>
        <div className="userName py-3">
          <form
            onSubmit={changeUserName}
            className="flex flex-col gap-2 justify-center items-start"
          >
            <label htmlFor="username">Edit User Name</label>
            <input
              type="text"
              name="username"
              id=""
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={userName}
              onChange={(e) => {
                setUserNameData({ ...userNameData, userName: e.target.value });
                setUserName(e.target.value);
              }}
            />
            <button
              type="submit"
              className="bg-purple-500 w-[100%] m-auto text-white text-xl rounded-full py-2 hover:bg-purple-600 md:w-[30%]"
            >
              Update{" "}
            </button>
          </form>
        </div>
        <div className="fullName py-3">
          <form
            onSubmit={changeFullName}
            className="flex flex-col gap-2 justify-center items-start"
          >
            <label htmlFor="username">Edit Full Name</label>
            <input
              type="text"
              name="fullName"
              id=""
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={fullName}
              onChange={(e) => {
                setFullNameData({
                  ...fullNameData,
                  fullName: e.target.value,
                });
                setFullName(e.target.value);
              }}
            />
            <button
              type="submit"
              className="bg-purple-500 w-[100%] m-auto text-white text-xl rounded-full py-2 hover:bg-purple-600 md:w-[30%]"
            >
              Update{" "}
            </button>
          </form>
        </div>
        <div className="phoneNo"></div>
      </div>
    </div>
  );
}

export default EditProfile;
