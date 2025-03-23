import useApi from "@/api/useApi";
import { time } from "@/time/time";
import { Modal } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import Comment from "./Comment";
import Liked from "./Like";
import ImageDetail from "./ImageDetail";

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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const [detailPost, setDetailPost] = useState<
    | null
    | {
        id: number;
        title: string;
        content: string;
        createdAt: Date;
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
        images?: { id: number; url: string; postId: number }[];
      }
    | undefined
  >(null);

  useEffect(() => {
    (async () => {
      if (postIdDetail) {
        try {
          const response = await api("GET", `/posts/${postIdDetail}`, {});
          console.log(response, 676767);
          setDetailPost(response);
        } catch (error) {
          setDetailPost(undefined);
          console.error("Failed to fetch post detail:", error);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postIdDetail]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const closeImageDetail = () => {
    setSelectedImageUrl(null);
  };

  return (
    <div>
      <Modal
        title={
          detailPost === undefined
            ? "Bài viết đã xóa"
            : `Chi tiết bài viết của ${detailPost?.author.name}`
        }
        open={onclick}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        {detailPost && (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <p className="mt-2">
              <p className="mt-2">{time(detailPost.createdAt)}</p>
            </p>
            <p className="mt-2">{detailPost.content}</p>
            <hr className="mt-2 border-black" />

            {detailPost.images && (
              <div className="flex">
                {detailPost.images.slice(0, 3).map((image) => (
                  <div
                    key={image.id}
                    className="flex-1 mr-2 relative cursor-pointer"
                    onClick={() => handleImageClick(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={`Image ${image.id}`}
                      layout="responsive"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                ))}
                {detailPost.images.length > 3 && (
                  <div className="flex-1 relative flex items-center justify-center bg-gray-200 rounded-md">
                    <span className="text-lg font-semibold">
                      +{detailPost.images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}

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

      {selectedImageUrl && (
        <ImageDetail imageUrl={selectedImageUrl} onClose={closeImageDetail} />
      )}
    </div>
  );
};

export default PostDetailModal;
