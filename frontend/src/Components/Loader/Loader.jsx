import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
function Loader() {
  return (
    <div className="fixed top-9 left-1/2 transform -translate-x-1/2 z-[100]">
      <ClipLoader
        color="blue"
        loading={true}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
        className=""
      />
    </div>
  );
}

export default Loader;
