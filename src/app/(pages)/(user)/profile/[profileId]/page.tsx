"use client";
import useApi from "@/api/useApi";
import FollowerList from "@/app/components/profile/FollowerList";
import FollowingList from "@/app/components/profile/FollowingList";
import PostList from "@/app/components/profile/PostList";
import { useQuery } from "@tanstack/react-query";
import { message, Spin } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";

const Page = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const profileId = Number(params.profileId);
  const userId = localStorage.getItem("userId");
  const { api } = useApi();
  const [view, setView] = useState("posts");

  const handleFollow = async (profileId: number) => {
    await api("POST", `/profile/${profileId}/follow`, {});
    refetch();
  };

  const fetchProfile = async () => {
    const response = await api("GET", `/profile/${profileId}`, {});
    setIsFollowing(response.isFollowing);
    return response;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleMessage = () => {
    messageApi.open({
      type: "warning",
      content: "Tính năng đang phát triển!",
    });
  };

  return (
    <>
      {/* <Header /> */}
      {contextHolder}
      <div className="h-screen dark:bg-gray-700 bg-gray-200 pt-0">
        <div className="max-w-full mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="border-b px-4 pb-6 flex items-center">
            <Image
              src={data.profile.avatarUrl || "/image/avt.jpg"}
              alt="User Avatar"
              width={180}
              height={180}
              className="rounded-full border-4 border-white dark:border-gray-800 mr-4"
            />
            <div className="flex flex-col flex-grow">
              <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                {data.profile.name || "Cait Genevieve"}
              </h3>
              <div className="inline-flex text-gray-700 dark:text-gray-300 items-center mt-2">
                {data.profile.isPrivate ? (
                  <>
                    <FaLock className="mr-1" />
                    Tài khoản riêng tư
                  </>
                ) : (
                  <>
                    <GiWorld className="mr-1" />
                    Tài khoản công khai
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mr-20">
              <span
                onClick={() => setView("followers")}
                className="cursor-pointer"
              >
                Người theo dõi{" "}
                <strong className="text-black dark:text-white">
                  {data.profile._count.following}
                </strong>
              </span>
              <br />
              <span
                onClick={() => setView("following")}
                className="cursor-pointer"
              >
                Đang theo dõi{" "}
                <strong className="text-black dark:text-white">
                  {data.profile._count.follower}
                </strong>{" "}
                người
              </span>
              <br />
              <span onClick={() => setView("posts")} className="cursor-pointer">
                Bài viết{" "}
                <strong className="text-black dark:text-white">
                  {data.profile._count.posts}
                </strong>
              </span>
            </div>
          </div>
          <div className="flex gap-2 px-2 ml-6 mt-2">
            {Number(data.profile.id) !== Number(userId) ? (
              <>
                <button
                  onClick={() => handleFollow(data.profile.id)}
                  className="w-24 rounded-full bg-blue-600 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-900 px-2 py-1"
                >
                  {isFollowing ? "UnFollow" : "Follow"}
                </button>
                <button
                  onClick={() => handleMessage()}
                  className="w-24 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-2 py-1"
                >
                  Nhắn tin
                </button>
              </>
            ) : (
              <div className="px-4 py-4">
                <button className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
                  Chỉnh sửa trang cá nhân
                </button>
              </div>
            )}
          </div>
          <div className="px-4 py-2">
            <hr className="border-gray-300 dark:border-gray-600 mb-2" />
            {data.profile.isPrivate && !isFollowing ? (
              <p className="text-red-500">
                Đây là tài khoản riêng tư. Hãy follow để xem thêm
              </p>
            ) : (
              <>
                {view === "posts" && (
                  <PostList
                    profileId={profileId}
                    profileName={data.profile.name}
                  />
                )}
                {view === "followers" && (
                  <FollowerList
                    profileId={profileId}
                    profileName={data.profile.name}
                  />
                )}
                {view === "following" && (
                  <FollowingList
                    profileId={profileId}
                    profileName={data.profile.name}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
