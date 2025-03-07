import { socket } from "@/api/instance";
import useApi from "@/api/useApi";
import { time } from "@/time/time";
import { Button, Dropdown, message, Popconfirm, Space } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import Liked from "./Like";
import PostDetailModal from "./PostDetail";
import ImageDetail from "./ImageDetail";
import axios from "axios";
import moment from "moment";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  avatars?: { id: number; url: string; createdAt: Date; updatedAt: Date }[];
};

type NewsItem = {
  _count: {
    Like: number;
    Comment: number;
  };
  author: User;
  liked: boolean;
  id: number;
  authorId: number;
  content?: string;
  images?: { id: number; url: string; postId: number }[];
  createdAt: Date;
};

const News = () => {
  const { api } = useApi();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [lastPostId, setLastPostId] = useState<number | null>(null);
  const [limit] = useState(3);
  const [isEndOfPosts, setIsEndOfPosts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const currentUserId = parseInt(localStorage.getItem("userId") || "0");

  const fetchPosts = async () => {
    if (loading || !isEndOfPosts) return;
    setLoading(true);

    try {
      const response = await api(
        "GET",
        `posts?lastPostId=${lastPostId}&limit=${limit}`,
        {}
      );

      if (response.length === 0) {
        setIsEndOfPosts(false);
      } else {
        setNewsData((prev) => [...prev, ...response]);
        setLastPostId(response[response.length - 1].id);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorDelete = error.response?.data.message;
        messageApi.error(errorDelete);
      } else {
        messageApi.error("Không thể tải bài viết");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    socket.on("newPost", (newPost) => {
      console.log(newPost);

      setNewsData((prev) => [newPost, ...prev]);
    });
    return () => {
      socket.off("newPost");
    };
  }, []);

  const loadMorePosts = () => {
    if (isEndOfPosts) {
      fetchPosts();
    }
  };

  const openDetailPost = (postId: number) => {
    setSelectedPostId(postId);
    setIsModalVisible(true);
  };

  const closeDetailPost = () => {
    setIsModalVisible(false);
    setSelectedPostId(null);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const closeImageDetail = () => {
    setSelectedImageUrl(null);
  };

  const handleOptions = async (key: string, newsId: number) => {
    switch (key) {
      case "delete":
        try {
          console.log("delete post");
          await api("DELETE", `posts/${newsId}`, {});
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const errorDelete = error.response?.data.userMessage;
            messageApi.error(errorDelete);
          } else {
            messageApi.error("Xóa thất bại");
          }
        }
        break;

      case "edit":
        console.log("edit post");
        break;

      case "report":
        console.log(`Báo cáo: ${newsId}`);
        break;

      default:
        console.log("Hành động không hợp lệ");
        break;
    }
  };

  const getMenuItems = (userId: number, newsId: number) => {
    const items = [];
    if (userId === currentUserId) {
      items.push({
        label: (
          <Popconfirm
            title="Chắc chưa?"
            onConfirm={() => handleOptions("delete", newsId)}
            okText="Có"
            cancelText="Không"
          >
            <a>Xóa</a>
          </Popconfirm>
        ),
        key: "delete",
      });

      items.push({
        label: "Chỉnh sửa",
        key: "edit",
        onClick: () => handleOptions("edit", newsId),
      });
    } else {
      items.push({
        label: "Báo cáo",
        key: "report",
        onClick: () => handleOptions("report", newsId),
      });
    }
    return items;
  };

  return (
    <div>
      {contextHolder}
      {newsData.map((news) => (
        <div
          key={news.id}
          className="bg-white rounded-md shadow-md p-4 mb-4 w-full"
        >
          <div className="flex justify-between">
            <div className="flex items-center">
              <Link href={`/profile/${news.authorId}`}>
                <Image
                  src={news.author?.avatars?.[0]?.url || "/image/avt.jpg"}
                  alt="User Avatar"
                  width={30}
                  height={30}
                  className="rounded-full mr-2 "
                />
              </Link>
              <div>
                <Link href={`/profile/${news.authorId}`}>
                  <h3 className="font-semibold text-lg">{news.author.name}</h3>
                </Link>
                <p
                  className="mt-1 text-xs"
                  title={moment(news.createdAt).format("DD/MM/YYYY HH:mm")}
                >
                  {time(news.createdAt)}
                </p>
              </div>
            </div>

            <Dropdown
              menu={{
                items: getMenuItems(news.authorId, news.id),
              }}
              trigger={["click"]}
            >
              <span
                onClick={(e) => e.preventDefault()}
                style={{ cursor: "pointer" }}
                tabIndex={0}
              >
                <Space>...</Space>
              </span>
            </Dropdown>
          </div>

          <p className="mt-2 text-lg">{news.content}</p>

          {news.images && (
            <div className="flex">
              {news.images.slice(0, 3).map((image) => (
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
              {news.images.length > 3 && (
                <div className="flex-1 relative flex items-center justify-center bg-gray-200 rounded-md">
                  <span className="text-lg font-semibold">
                    +{news.images.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
          <hr className="mt-4 border-black" />
          <div className="flex justify-between items-center mt-2">
            <Liked
              postId={news.id}
              initiallyLiked={news.liked}
              initialLikesCount={news._count.Like}
            />
            <div
              className="flex items-center cursor-pointer"
              onClick={() => openDetailPost(news.id)}
            >
              <FaRegComment className="text-gray-400 mr-2" />
              <span>{news._count.Comment} bình luận</span>
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={loadMorePosts}
        disabled={loading || !isEndOfPosts}
        loading={loading}
        type="primary"
        style={{ marginTop: "20px" }}
      >
        Tải thêm bài viết
      </Button>

      {selectedPostId && (
        <PostDetailModal
          onclick={isModalVisible}
          onClose={closeDetailPost}
          postIdDetail={selectedPostId}
        />
      )}

      {selectedImageUrl && (
        <ImageDetail imageUrl={selectedImageUrl} onClose={closeImageDetail} />
      )}
    </div>
  );
};

export default News;
