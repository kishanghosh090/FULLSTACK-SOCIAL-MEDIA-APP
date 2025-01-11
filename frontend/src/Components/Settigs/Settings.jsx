import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BackNavigation from "../BackNavigationBar/BackNavigation";
import { MdModeEditOutline } from "react-icons/md";
import { GrPowerShutdown } from "react-icons/gr";
import axios from "axios";
import baseUrl from "../../../baseUrl.js";

function Settings() {
  const navigator = useNavigate();
  const loggoutHandler = () => {
    axios
      .post(`${baseUrl}/api/v1/users/logout`)
      .then(() => {
        navigator("/login", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <BackNavigation settins="settings" />
      <div className="mt-[4rem] px-3 py-4">
        <ul className="flex flex-col gap-2">
          <NavLink
            to="/Settings/edit-profile"
            className="py-3 px-5 text-xl border-b-2 flex justify-between items-center"
          >
            Edit Profile
            <MdModeEditOutline />
          </NavLink>
          <NavLink
            onClick={loggoutHandler}
            className=" py-3 px-5 text-xl flex justify-between items-center border-b-2"
          >
            Logout
            <GrPowerShutdown />
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
