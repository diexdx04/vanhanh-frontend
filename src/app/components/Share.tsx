import React from "react";
import { IoShareOutline } from "react-icons/io5";

const Share: React.FC = () => {
  console.log("component share");

  return (
    <button className="cursor-pointer mt-2 flex items-center">
      <IoShareOutline className="text-2xl" />
      <h1 className="ml-2">Share</h1>{" "}
    </button>
  );
};

export default Share;
