import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function BackNavigation(props) {
 


  const navigator = useNavigate();
  const goBack = () => {
    navigator(-1, { replace: true });
  };
  return (
    <div
      className="absolute top-0 left-0 bg-slate-100 justify-start px-5 py-4 text-black cursor-pointer w-full z-50 flex items-center"
      id="back"
    >
      <span className="mr-5 text-xl border-2 p-1 rounded-full" onClick={goBack}>
        <FaArrowLeft />
      </span>
      <span>
        <h2 className="text-left text-slate-700 text-2xl">
          {Object.values(props)}
        </h2>
      </span>
    </div>
  );
}

export default BackNavigation;
