// NewsFeed.tsx
"use client";
import News from "@/app/components/news";
import Post from "@/app/components/Post";
import { useState } from "react";

const NewsFeed = () => {
  const [refreshAt, setRefreshAt] = useState(new Date());

  return (
    <div className="min-h-screen bg-gray-200 p-4 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white rounded-md shadow-md mb-6 p-6">
        <h2 className="text-2xl font-bold">News Feed</h2>
      </div>

      <div className="max-w-xl w-full bg-white rounded-md shadow-md mb-6 p-6">
        <Post setRefreshAt={setRefreshAt} />
      </div>

      <div className="max-w-xl w-full bg-white rounded-md shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Bảng Tin</h3>
        <News refreshAt={refreshAt} />
      </div>
    </div>
  );
};

export default NewsFeed;
