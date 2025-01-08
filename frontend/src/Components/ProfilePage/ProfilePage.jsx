import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getMessageError, getMessageSuccess } from "../../Hooks/popUpMessage";
import axios from "axios";
import Header from "../Header/Header";
import BottomNav from "../BottomNav/BottomNav";
import avatarDefault from "../../../public/default-avatar.jpg";
import UserPost from "./UserPost";

export default function ProfilePage() {
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/v1/")
      .then((res) => {
        setIsOpen(true);
        setData(res.data.data);
        setPosts(res.data.data.posts);

        getMessageSuccess(res.data.message);
      })
      .catch((err) => {
        window.location.href = "/Login";
        getMessageError(err?.response?.data.message);
      });
  }, []);

  return (
    <>
      <Toaster />
      {isOpen && (
        <div>
          {/* header */}
          <Header data={data} />
          <div className="h-full bg-slate-100 flex flex-col gap-2 p-2 transition-opacity z-[5]">
            <Card className="py-4 mt-[7rem] relative bg-white dark:text-black flex flex-col items-center justify-center">
              <div className="edit w-full">
                <Dropdown className="relative">
                  <DropdownTrigger className="bg-transparent text-black">
                    <Button isIconOnly color="black">
                      <CiMenuKebab color="black" />
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu aria-label="Example with disabled actions">
                    <DropdownItem
                      key="edit"
                      onClick={() => {
                        navigate("Settings/edit-profile");
                      }}
                    >
                      Edit Profile
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <CardBody className="overflow-visible py-2 flex justify-center items-center p-5 z-[5]">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={`${data.avatar || avatarDefault}`}
                  width={270}
                  height={250}
                  classNames="bg-cover"
                />
              </CardBody>
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-center justify-center z-[5]">
                <h4 className="font-bold text-[1.6rem]">{data.fullName}</h4>
                <p className="text-tiny  font-medium text-[1rem]">
                  {data.email}
                </p>
              </CardHeader>
              <CardFooter className="mt-4 flex items-center py-2 justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden  before:rounded-xl rounded-large bottom-1 shadow-small ml-1 z-[5]-10 w-[50%]">
                <p className=" text-black  font-bold z-[5]">{data.userName}</p>
                <Link
                  to="Settings/edit-profile"
                  className="bg-purple-600 text-white px-3 py-2 rounded-full flex items-center justify-center"
                >
                  <MdDriveFileRenameOutline />
                </Link>
              </CardFooter>
            </Card>

            {/* activity */}
            <div className="activity pb-[7rem]">
              <h1 className="text-[1.2rem] text-center m-3 font-bold">
                {data.userName}'s Activity
              </h1>
              <UserPost posts={posts} />
            </div>
          </div>
          <BottomNav />
        </div>
      )}
    </>
  );
}
