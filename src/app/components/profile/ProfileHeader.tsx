"use client";

import useApi from "@/api/useApi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaLock } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";

const ProfileHeader = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const params = useParams();
  const profileId = Number(params.profileId);
  const userId = localStorage.getItem("userId");
  const { api } = useApi();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (profileId: number) => {
      await api("POST", `/profile/${profileId}/follow`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });

  const fetchProfile = async () => {
    const response = await api("GET", `/profile/${profileId}`, {});
    return response;
  };

  const { data, isLoading, error } = useQuery({
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

  console.log(data, 12345);

  return (
    <div>
      {contextHolder}
      <div className="max-w-full mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="border-b px-4 pb-6 flex items-center">
          <Image
            src={data.profile?.avatars?.[0]?.url || "/image/avt.jpg"}
            alt="User Avatar"
            width={180}
            height={180}
            className="rounded-full border-4 border-white dark:border-gray-800 mr-4 object-cover"
            style={{ width: "180px", height: "180px" }}
          />
          <div className="flex flex-col flex-grow">
            <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
              {data.profile?.name}
            </h3>
            <div className="inline-flex text-gray-700 dark:text-gray-300 items-center mt-2">
              {data.profile?.isPrivate ? (
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
            <Link href={`/profile/${data.profile?.id}/followingList`}>
              <span className="cursor-pointer">
                Người theo dõi{" "}
                <strong className="text-black dark:text-white">
                  {data.profile?._count.follower}
                </strong>
              </span>
            </Link>
            <br />

            <Link href={`/profile/${data.profile?.id}/followerList`}>
              <span className="cursor-pointer">
                Đang theo dõi{" "}
                <strong className="text-black dark:text-white">
                  {data.profile?._count.following}
                </strong>{" "}
                người
              </span>
            </Link>
            <br />
            <Link href={`/profile/${data.profile?.id}`}>
              <span className="cursor-pointer">
                Bài viết{" "}
                <strong className="text-black dark:text-white">
                  {data.profile?._count.posts}
                </strong>
              </span>
            </Link>
          </div>
        </div>
        <div className="flex gap-2 px-2 ml-6 mt-2 border-b border-gray-300 dark:border-gray-700">
          {Number(data.profile?.id) !== Number(userId) ? (
            <>
              <div className="p-3">
                <Button
                  onClick={() => mutate(data.profile.id)}
                  className="bg-blue-500 text-white font-semibold py-1 px-2 rounded hover:bg-blue-600 w-24 rounded-full mr-2"
                >
                  {data.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                </Button>
                <Button
                  onClick={() => handleMessage()}
                  className="bg-blue-500 text-white font-semibold py-1 px-2 rounded hover:bg-blue-600 w-24 rounded-full"
                >
                  Nhắn tin
                </Button>
              </div>
            </>
          ) : (
            <div className="px-4 py-4 ml-20">
              <Link href={"/profile-setting"}>
                <button className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
                  Chỉnh sửa trang cá nhân
                </button>
              </Link>
            </div>
          )}

          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
