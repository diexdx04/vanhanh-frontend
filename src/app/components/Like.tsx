"use client";
import useApi from "@/api/useApi";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type User = {
  id: number;
  name: string;
};

type LikeProps = {
  postId: number;
  initiallyLiked: boolean;
  initialLikesCount: number;
};

const Liked: React.FC<LikeProps> = ({
  postId,
  initiallyLiked,
  initialLikesCount,
}) => {
  const { api } = useApi();
  const [liked, setLiked] = useState(initiallyLiked);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(initialLikesCount);

  useEffect(() => {
    console.log("component like");

    setLiked(initiallyLiked);
  }, [initiallyLiked]);

  const fetchLikes = async () => {
    console.log(initiallyLiked, 888);

    console.log(postId, 66);

    try {
      const response = await api("GET", `posts/${postId}/like`, {});
      setLikedUsers(response.likers);
      setLikeCount(response.likers.length);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLike = async () => {
    try {
      await api("POST", `posts/${postId}/like`, { liked: !liked });
      const newLiked = !liked;
      setLiked(newLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowModal = () => {
    fetchLikes();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <button className="mr-2 flex items-center" onClick={handleShowModal}>
        {likeCount} Lượt thích
      </button>
      <hr />
      <button
        onClick={toggleLike}
        className="cursor-pointer mt-2 flex items-center"
      >
        {liked ? (
          <AiFillHeart className="text-red-500 text-3xl" />
        ) : (
          <AiOutlineHeart className="text-gray-400 text-3xl" />
        )}
      </button>
      <Modal
        title="Người thích"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {likedUsers.length > 0 ? (
          <ul>
            {likedUsers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>Chưa có ai thích bài viết</p>
        )}
      </Modal>
    </div>
  );
};

export default Liked;
