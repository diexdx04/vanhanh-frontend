"use client";
import useApi from "@/api/useApi";
import { useEffect, useState } from "react";
import Liked from "./Like";
import { Modal } from "antd";

type User = {
  name: string;
  id: number;
};

type NewsItem = {
  likeCount: number;
  liked: boolean;
  id: number;
  title: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likers: User[];
};

const News = ({ refreshAt }: { refreshAt: Date }) => {
  const { api } = useApi();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [boxLiked, setBoxLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await api("GET", "posts", {});

      setNewsData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshAt]);

  const fetchLikes = async (postId: number) => {
    try {
      const response = await api("GET", `posts/${postId}/likes`, {});

      setLikedUsers(response.likers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikesClick = (post: NewsItem) => {
    fetchLikes(post.id);
    setBoxLiked(true);
  };

  const handleListLike = () => {
    setBoxLiked(false);
  };

  return (
    <div>
      {newsData.map((news) => (
        <div key={news.id} className="bg-white rounded-md shadow-md p-4 mb-4">
          <h3 className="text-sm">{`Author ID: ${news.authorId}`}</h3>
          <p className="mt-2">{news.createdAt}</p>
          <h2 className="font-semibold text-lg">{news.title}</h2>
          <p className="mt-2">{news.content}</p>
          <hr className="mt-4" />
          <div className="mt-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLikesClick(news);
              }}
            >
              <p className="mt-2">{`${news.likeCount} lượt thích`}</p>
            </a>
            <Liked
              postId={news.id}
              initiallyLiked={news.liked}
              onUpdate={fetchPosts}
              onFetchLikes={fetchLikes}
            />
          </div>
        </div>
      ))}

      <Modal
        title="Danh sách người thích"
        open={boxLiked}
        onCancel={handleListLike}
        footer={null}
      >
        <ul>
          {likedUsers.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default News;
