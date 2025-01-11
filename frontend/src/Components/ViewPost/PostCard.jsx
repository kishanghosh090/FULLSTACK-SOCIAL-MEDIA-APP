import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
} from "@nextui-org/react";
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../../public/default-avatar.jpg";
import { BiSolidLike } from "react-icons/bi";
import axios from "axios";
import {baseUrl} from "../../../baseUrl.js";

export default function PostCard(postData) {
  const likeHandle = (postCardId) => {
    axios
      .patch(`${baseUrl}/api/v1/posts/likePost`, {
        likedPostId: postCardId,
      })
      .then((res) => {
        console.log(res);
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFollow = () => {};
  return (
    <div className="pt-[6rem] px-3 pb-20">
      {postData?.postData?.map((post) => {
        return (
          <Card className="py-4 m-2 z-[5] px-2" key={post._id}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <NavLink
                to={`/viewPost/${post?.user._id}`}
                className="cardOwer flex justify-center items-center gap-3 bg-slate-100 w-full py-2 rounded-3xl cursor-pointer"
              >
                <Image
                  alt="Card background"
                  className="object-cover rounded-full"
                  src={`${post?.user.avatar || defaultAvatar}`}
                  width={50}
                  height={50}
                />
                <p className=" uppercase font-bold">{post?.user.fullName}</p>
              </NavLink>
              <div className="cardTitle mt-2">{post?.title || ""}</div>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={post.image}
                width={270}
              />
            </CardBody>
            <CardFooter className="py-2 description">
              {post?.description || ""}
            </CardFooter>
            <div className="footer flex justify-between px-2">
              <button
                onClick={() => likeHandle(post?._id)}
                className="like m-3 text-2xl text-red flex justify-start items-center"
              >
                <BiSolidLike
                  style={{
                    color: `${
                      post?.likes?.includes(post?.user._id) ? "red" : "black"
                    }`,
                  }}
                />
                <span className="ml-2">{post?.likes?.length}</span>
              </button>
              <button
                onClick={() => {
                  handleFollow(post?.user?._id);
                }}
                className={` px-2 h-9  text-white rounded-3xl bg-purple-700`}
              >
                Follow
              </button>
            </div>
          </Card>
        );
      }) || ""}
    </div>
  );
}
