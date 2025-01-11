import React, { useState } from "react";
import BackNavigation from "../BackNavigationBar/BackNavigation";
import { getMessageError, getMessageSuccess } from "../../Hooks/popUpMessage";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../baseUrl.js";

function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState({
    image: null,
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title && !description && !image) {
      getMessageError("At least title, description, and image are required");
      return;
    }
    console.log(data);
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/posts/createPost`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        getMessageSuccess("Post created successfully");
        setLoading(false);
        setDescription("");
        setTitle("");
        setImage(null);
        navigate("/ViewPost", { replace: true });
        return;
      })
      .catch((err) => {
        setLoading(false);
        setDescription("");
        setTitle("");
        setImage(null);
        getMessageError(err.response.data.message);
        return;
      });
  };

  return (
    <div>
      <BackNavigation createPost="create post" />
      <Toaster />
      <div className="mt-[8rem] px-3 bg-slate-100 w-[90%] m-auto py-2">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label htmlFor="title">Enter title</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={(e) => {
              setData({ ...data, title: e.target.value });
              setTitle(e.target.value);
            }}
            value={title}
            placeholder="Enter title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label htmlFor="description">Enter description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            onChange={(e) => {
              setData({ ...data, description: e.target.value });
              setDescription(e.target.value);
            }}
            placeholder="Enter description"
            value={description}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-[10rem] flex items-center"
          />
          {/* input image */}
          <label htmlFor="image">Choose Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            onChange={(e) => {
              setData({ ...data, image: e.target.files[0] });
              setImage(e.target.files[0]);
            }}
          />
          {/* show image */}
          <label htmlFor="image">Show image</label>
          <img
            src={image ? URL.createObjectURL(image) : ""}
            alt=""
            className="h-[10rem] rounded-2xl"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline flex items-center justify-center rounded-full"
          >
            <span className="mr-2">Create Post</span>
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

export default CreatePost;
