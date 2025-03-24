"use client";
import useApi from "@/api/useApi";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Popconfirm, Spin, Tooltip } from "antd";
import { useParams } from "next/navigation";
import React from "react";
import { FaLock } from "react-icons/fa";

interface Following {
  id: number;
  name: string;
  avatar: string;
}

const Page = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const profileId = Number(params.profileId);
  const userId = Number(localStorage.getItem("userId"));
  const { api } = useApi();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await api("GET", `/profile/${profileId}`, {});
    },
    enabled: !!profileId,
  });

  const {
    data: following,
    isLoading,
    error,
  } = useQuery<Following[]>({
    queryKey: ["following"],
    queryFn: async () => {
      if (profile.profile.isPrivate && profile.isFollowing === false) {
        return [];
      }

      return await api("GET", `/profile/${profileId}/following`, {});
    },
    enabled: profile?.isFollowing,
  });

  const { mutate } = useMutation({
    mutationFn: async (followingId: number) => {
      await api("DELETE", `/profile/${profileId}/follow`, { followingId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"],
      });
    },
  });

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    console.log("error:", error);
  }

  return (
    <div>
      {profile.profile.isPrivate && profile.isFollowing === false ? (
        <div className="flex flex-col items-center mt-20">
          <div className="text-6xl mb-4">
            <i className="">
              <FaLock />
            </i>
          </div>
          <h1 className="text-xxsl">Đây là tài khoản riêng tư</h1>
          <p className="text-gray-500">
            Hãy theo dõi tài khoản này để xem thêm
          </p>
        </div>
      ) : (
        <div className="bg-white p-5">
          <div className="w-4/5 bg-white max-w-screen-md mx-auto">
            <div className="flex justify-center mb-4">
              <Input
                className="max-w-xs mt-2"
                placeholder="Enter your username"
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                suffix={
                  <Tooltip title="Extra information">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {following?.map((following) => (
                <div
                  key={following.id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-400"
                >
                  <div className="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-gray-500">avt</span>
                  </div>
                  <h2 className="font-bold mt-2">{following.name}</h2>
                  <Button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">
                    Theo dõi
                  </Button>
                  {userId === profileId && (
                    <Popconfirm
                      placement="top"
                      title={
                        <span>
                          Sẽ không có thông báo cho{" "}
                          <strong>{following.name}</strong> biết rằng <br /> bạn
                          xóa họ khỏi danh sách người theo dõi mình.
                        </span>
                      }
                      onConfirm={() => mutate(following.id)}
                      okText="Ok"
                      cancelText="Cancel"
                      className="mt-2"
                    >
                      <Button className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600">
                        Xóa theo dõi
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
