"use client";
import useApi from "@/api/useApi";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Input, Spin, Tooltip } from "antd";
import { useParams } from "next/navigation";
import React from "react";
const Page = () => {
  const params = useParams();
  const profileId = Number(params.profileId);
  const { api } = useApi();

  const fetchFollowing = async () => {
    const response = await api("GET", `/profile/${profileId}/following`, {});
    return response;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["following"],
    queryFn: fetchFollowing,
  });

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    console.log("error:", error);
  }

  return (
    <div>
      <div className="bg-white p-5">
        <div className="max-w-screen-md mx-auto">
          <div className="flex items-center mb-4">
            {/* <h2 className="text-xl mr-4">Danh sách </h2> */}
            <Input
              className="max-w-xs ml-auto"
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
            {data.map((following) => (
              <div
                key={following.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                <div className="bg-gray-300 rounded-full w-24 h-24 flex items-center justify-center">
                  <span className="text-gray-500">avt</span>
                </div>
                <h2 className="font-bold mt-2">{following.name}</h2>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
