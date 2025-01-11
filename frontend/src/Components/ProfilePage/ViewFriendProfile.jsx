import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDriveFileRenameOutline } from "react-icons/md";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
} from "@nextui-org/react";

import BackNavigation from "../BackNavigationBar/BackNavigation";
import defaultAvatar from "../../../public/default-avatar.jpg";
import baseUrl from "../../../baseUrl.js";

function ViewFriendProfile() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const native = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/v1/posts/getUserProfileFromPost/${id}`)
      .then((res) => {
        if (res.data.message === "You are viewing your  Profile") {
          native("/");
          return;
        } else {
          setIsOpen(true);
          setData(res.data.data);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, []);
  return (
    <>
      {isOpen && (
        <div>
          <BackNavigation user={`${data.fullName}`} />
          <div className="mx-2">
            <Card className="py-4 mt-[7rem] relative bg-white dark:text-black flex flex-col items-center justify-center">
              <CardBody className="overflow-visible py-2 flex justify-center items-center p-5 z-[5]">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={`${data.avatar || defaultAvatar}`}
                  width={270}
                  height={250}
                  classNames="bg-cover"
                />
              </CardBody>
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center">
                <h4 className="font-bold text-[1.6rem]">{data.fullName}</h4>
                <p className="text-tiny  font-medium text-[1rem]">
                  {data.email}
                </p>
              </CardHeader>
              <CardFooter className="mt-4 flex items-center py-2 justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden  before:rounded-xl rounded-large bottom-1 shadow-small z-10 w-[50%]">
                <p className=" text-black  font-bold w-full text-center">
                  {data.userName}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewFriendProfile;
