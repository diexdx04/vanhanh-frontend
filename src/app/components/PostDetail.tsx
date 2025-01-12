import useApi from "@/api/useApi";
import { Modal } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import Liked from "./Like";
import Comment from "./Comment";

type PostDetailModalProps = {
  onclick: boolean;
  onClose: () => void;
  postIdDetail: number | null;
};

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  onclick,
  onClose,
  postIdDetail,
}) => {
  const { api } = useApi();
  const [detailPost, setDetailPost] = useState<null | {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      id: number;
    };
    _count: {
      Like: number;
      Comment: number;
    };
    userLiked: boolean;
    Like: { user: { id: number; name: string } }[];
  }>(null);

  useEffect(() => {
    (async () => {
      if (postIdDetail) {
        try {
          const response = await api("GET", `/posts/${postIdDetail}`, {});
          setDetailPost(response);
        } catch (error) {
          console.error("Failed to fetch post detail:", error);
        }
      }
    })();
  }, [postIdDetail]);

  return (
    <div>
      <Modal
        title={`Chi tiết bài viết của ${detailPost?.author.name}`}
        open={onclick}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        {detailPost && (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <p className="mt-2">
              {moment(detailPost.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <h3 className="font-semibold text-lg">{detailPost.title}</h3>
            <p className="mt-2">{detailPost.content}</p>
            <hr className="mt-2 border-black" />

            <div className="flex justify-between mt-1"></div>
            <div className="flex justify-between items-center mt-2">
              <Liked
                postId={detailPost.id}
                initiallyLiked={detailPost.userLiked}
                initialLikesCount={detailPost._count.Like}
              />
              <div className="flex items-center cursor-pointer">
                <FaRegComment className="text-gray-400 mr-2" />
                <span>{detailPost._count.Comment} bình luận</span>
              </div>
            </div>
            <hr className="mt-2 border-black" />
            <Comment postId={detailPost.id} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PostDetailModal;
