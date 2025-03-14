"use client";
import useApi from "@/api/useApi";
import PostList from "@/app/components/profile/PostList";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaLock } from "react-icons/fa";

const Page = () => {
  const params = useParams();
  const profileId = Number(params.profileId);
  const { api } = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api("GET", `/profile/${profileId}`, {});
      return response;
    },
    enabled: !!profileId,
  });

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    console.log(error);
  }

  return (
    <>
      {data.profile.isPrivate && data.isFollowing === false ? (
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
        <div className="h-screen dark:bg-gray-700 bg-gray-200 pt-0">
          <div className="max-w-full mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-center border-b bg-gray-100 p-6">
              <div className="flex w-4/5 space-x-4">
                {" "}
                {/* Sidebar */}
                <div className="w-2/5 bg-gray-100 h-100px">
                  <div className="w-full bg-white p-2 border border-gray-300 rounded-md">
                    <h2 className="font-semibold text-lg">Giới thiệu</h2>

                    <p className="text-sm">gioi tinh</p>
                    <p className="text-sm">Ngay sinh</p>
                    <p className="text-sm">Den tu thai binh</p>
                  </div>

                  <div>
                    <div className="bg-white max-w-screen-lg mx-auto p-2 border border-gray-300 rounded-md mt-4">
                      <h2 className="text-xl font-semibold mb-4">Ảnh</h2>
                      <div className="grid grid-cols-3 gap-4">
                        {" "}
                        <div className="overflow-hidden rounded-lg shadow-md">
                          <Image
                            src="/image/avt.jpg"
                            alt=""
                            layout="responsive"
                            width={100}
                            height={100}
                            className="rounded-md h-32 w-full object-cover"
                          />
                        </div>
                      </div>
                      <a
                        href="#"
                        className="block mt-4 text-blue-500 hover:underline"
                      >
                        Xem tất cả ảnh
                      </a>
                    </div>
                  </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 border border-gray-300 rounded-md">
                  {" "}
                  <div className="flex-grow">
                    <PostList
                      profileId={profileId}
                      profileName={data.profile.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
