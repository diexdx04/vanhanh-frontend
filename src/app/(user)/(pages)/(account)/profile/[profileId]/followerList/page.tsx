"use client";
import useApi from "@/api/useApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Spin, Tooltip } from "antd";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { FaLock } from "react-icons/fa";
import Image from "next/image";

interface Follower {
  id: number;
  name: string;
  avatar: string;
}

const Page = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const profileId = Number(params.profileId);
  const { api } = useApi();
  const userId = Number(localStorage.getItem("userId"));

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await api("GET", `/profile/${profileId}`, {});
    },
    enabled: !!profileId,
  });

  const { data, isLoading, error } = useQuery<Follower[]>({
    queryKey: ["follower"],
    queryFn: async () => {
      if (profile.profile.isPrivate && profile.isFollowing === false) {
        return [];
      }
      return await api("GET", `profile/${profileId}/follower`, {});
    },
    enabled: profile?.isFollowing,
  });

  const { mutate } = useMutation({
    mutationFn: async (followingId: number) => {
      await api("POST", `/profile/${followingId}/follow`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follower"],
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
        <div className="bg-gray-200 p-5 ">
          <div className="w-4/5 bg-white max-w-screen-md mx-auto rounded-md p-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.map((follower) => (
                <div
                  key={follower.id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center border border-gray-400"
                >
                  <div className="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center overflow-hidden">
                    <Image
                      src={follower.avatar || "/image/avt.jpg"}
                      alt="avatar-img"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-bold mt-2">{follower.name}</h2>
                  {userId !== follower.id && (
                    <Button
                      onClick={() => mutate(follower.id)}
                      className="bg-blue-500 text-white font-semibold py-1 px-2 rounded hover:bg-blue-600 w-24 mr-2"
                    >
                      {profile.isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                    </Button>
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
