// components/News.tsx
"use client";
import { instance } from "@/api/instance";
import React, { useEffect, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const News = ({ refreshAt }: { refreshAt: Date }) => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await instance.get("/posts/getPosts");
        setNewsData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [refreshAt]);

  return (
    <div>
      {newsData.map((news) => (
        <div key={news.id} className="bg-white rounded-md shadow-md p-4 mb-4">
          <h3 className="text-sm">{`Author ID: ${news.authorId}`}</h3>
          <p className="mt-2">{news.createdAt}</p>
          <h2 className="font-semibold text-lg">{news.title}</h2>
          <p className="mt-2">{news.content}</p>
        </div>
      ))}
    </div>
  );
};

export default News;
