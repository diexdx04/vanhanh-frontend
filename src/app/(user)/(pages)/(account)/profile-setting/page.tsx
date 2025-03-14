"use client";
import useApi from "@/api/useApi";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import Image from "next/image";

const AccountPage = () => {
  const { api } = useApi();
  const fetchAccount = async () => {
    const response = await api("GET", "/user", {});
    return response;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
  });

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Chỉnh sửa trang cá nhân</h2>

        <div className="mb-4 flex items-center">
          <Image
            src={data?.avatars?.[0]?.url || "/image/avt.jpg"}
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full border-4 border-white dark:border-gray-800 mr-4 object-cover"
            style={{ width: "80px", height: "80px" }}
          />
          <button className="ml-10 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
            đổi ảnh đại diện
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ten</label>
          <input
            type="text"
            placeholder="Ex. Bonnie Green"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
