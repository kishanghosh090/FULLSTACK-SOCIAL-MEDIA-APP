import React from "react";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SlFeed } from "react-icons/sl";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { FaUserFriends } from "react-icons/fa";
function BottomNav() {
  return (
    
    <div className="fixed bottom-0 w-full bg-slate-100 p-4 z-50">
      <ul className="flex justify-between items-center">
        <li>
          <NavLink
            color="primary"
            variant="flat"
            to="/"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#001630] text-[#66aaf9]" : ""
              } flex justify-center items-center flex-col  px-5 py-1 rounded-full w-[4rem] transition-transform`
            }
          >
            <FaUser /> <p className="text-[0.8rem]">Home</p>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/ViewChat"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#001630] text-[#66aaf9]" : ""
              } flex justify-center items-center flex-col px-5 py-1 rounded-full w-[4rem] transition-transform`
            }
          >
            <FaMessage />
            <p className="text-[0.8rem]">Chat</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Friends"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#001630] text-[#66aaf9]" : ""
              } flex justify-center items-center flex-col px-5 py-1  rounded-full w-[4rem] transition-transform`
            }
          >
            <FaUserFriends />
            <p className="text-[0.8rem]">Friends</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ViewPost"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#001630] text-[#66aaf9]" : ""
              } flex justify-center items-center flex-col px-5 py-1  rounded-full w-[4rem] transition-transform`
            }
          >
            <SlFeed />
            <p className="text-[0.8rem]">Feed</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default BottomNav;
