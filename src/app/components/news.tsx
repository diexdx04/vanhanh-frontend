import { socket } from "@/api/instance";
import useApi from "@/api/useApi";
import { time } from "@/time/time";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import Liked from "./Like";
import PostDetailModal from "./PostDetail";

type User = {
  id: number;
  name: string;
};

type NewsItem = {
  _count: {
    Like: number;
    Comment: number;
  };
  author: User;
  liked: boolean;
  id: number;
  title: string;
  authorId: number;
  content: string;
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

  const fetchPosts = async () => {
    if (loading || !isEndOfPosts) return;
    setLoading(true);

    try {
      const response = await api(
        "GET",
        `posts?lastPostId=${lastPostId}&limit=${limit}`,
        {}
      );

      console.log(555, response);

      if (response.length === 0) {
        setIsEndOfPosts(false);
        console.log("Hết bài viết!");
      } else {
        setNewsData((prev) => [...prev, ...response]);
        console.log("Tổng số bài viết:", response.length + newsData.length);
        setLastPostId(response[response.length - 1].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    socket.on("newPost", (newPost) => {
      console.log("Bài viết mới:", newPost);
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

  return (
    <div>
      {newsData.map((news) => (
        <div
          key={news.id}
          className="bg-white rounded-md shadow-md p-4 mb-4 w-full"
        >
          <h3 className="font-semibold text-lg">{news.author.name}</h3>
          <p className="mt-2">{time(news.createdAt)}</p>
          <h2 className="font-semibold text-lg">{news.title}</h2>
          <p className="mt-2">{news.content}</p>
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
    </div>
  );
};

export default News;
