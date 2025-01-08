import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import avatarDefault from "../../../public/default-avatar.jpg";
export default function Header(data) {
  const navigator = useNavigate();
  const handleLogout = () => {
    axios
      .post("api/v1/users/logout")
      .then(() => {
        window.location.href = "/Login";
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="bg-slate-500 fixed  w-full z-[10]">
      <Navbar className="flex justify-between p-2 bg-slate-200">
        <NavbarContent>
          <NavbarBrand className="mr-4">
            <p className=" sm:block font-bold text-inherit">ACME</p>
          </NavbarBrand>
          {/* <div className="search-btn absolute flex top-[200%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 p-3 border-black z-[11] bg-red-300 rounded-lg">
            <form className="flex gap-2">
              <input
                type="search"
                name="search"
                id=""
                placeholder="Type to search.."
                className=" p-2 rounded text-black border-2 border-slate-600"
              />
              <button className=" p-1 flex justify-center items-center h-10 w-10 rounded-full border-2 border-slate-600">
                <IoSearch />
              </button>
            </form>
          </div>
          <div className="search-box bg-slate-200 m-auto absolute top-[460%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[12] w-[95%] h-[30vh] overflow-y-scroll py-2">
            <NavLink className="flex bg-black mx-2">
              <img src="" alt="" className="w-[4rem] h-[4rem] rounded-full z-[10]" />
              <p>kishan rana ghosh</p>
            </NavLink>
          </div> */}
          <NavLink
            color="primary"
            variant="flat"
            to="/CreatePost"
            className={({ isActive }) =>
              `${
                isActive ? "" : ""
              } flex justify-center items-center flex-col   py-1 rounded-full w-[5rem] text-[2rem] bg-green-400 text-green-900`
            }
          >
            <CiCirclePlus />
          </NavLink>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={`${data?.data?.avatar || avatarDefault}`}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">
                  {data?.data?.email || "default"}
                </p>
              </DropdownItem>
              <DropdownItem
                key="settings"
                onClick={() => {
                  navigator("/Settings");
                }}
              >
                My Settings
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
