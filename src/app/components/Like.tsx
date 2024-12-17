"use client";
import useApi from "@/api/useApi";
import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeProps {
  postId: number;
  initiallyLiked: boolean;
  onUpdate: () => void;
  onFetchLikes: (postId: number) => void;
}

const Liked: React.FC<LikeProps> = ({
  postId,
  initiallyLiked,
  onUpdate,
  onFetchLikes,
}) => {
  const { api } = useApi();
  const [liked, setLiked] = useState(initiallyLiked);

  const toggleLike = async () => {
    try {
      await api("POST", `like/${postId}`, { liked: !liked });
      setLiked(!liked);
      onUpdate();
      onFetchLikes(postId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div onClick={toggleLike} className="cursor-pointer">
      {liked ? (
        <AiFillHeart className="text-red-500 text-3xl" />
      ) : (
        <AiOutlineHeart className="text-gray-400 text-3xl" />
      )}
    </div>
  );
};

export default Liked;
