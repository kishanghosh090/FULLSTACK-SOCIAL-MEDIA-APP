import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import PostCard from "./PostCard";
import axios from "axios";
import { getMessageError, getMessageSuccess } from "../../Hooks/popUpMessage";
import { Toaster } from "react-hot-toast";

function ViewPost() {
  const [postData, setPostData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios
      .get("api/v1/posts/getAllPosts")
      .then((res) => {
        console.log(res);
        setUserData(res.data.data.user);
        setPostData(res.data.data.posts);
        getMessageSuccess(res.data.message);
        return;
      })
      .catch((err) => {
        getMessageError(err.response.data.message);
        console.log(err);
        return;
      });
  }, []);

  return (
    <div>
      <Toaster />
      <Header data={userData} />
      <div>
        <PostCard postData={postData} />
      </div>
    </div>
  );
}

export default ViewPost;
