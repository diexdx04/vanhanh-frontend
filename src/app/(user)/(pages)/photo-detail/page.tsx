// src/app/(user)/(pages)/photo-detail/page.tsx
"use client";
import useApi from "@/api/useApi";
import { time } from "@/time/time";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import moment from "moment";

import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";

const PhotoDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const photoId = searchParams.get("photoId");
  const isAvatar = searchParams.get("setA");
  const { api } = useApi();

  const fetchProfile = async () => {
    const response = await api("GET", `/profile/photo/${photoId}`, {
      isAvatar,
    });
    console.log(response, 99999);

    return response;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!photoId,
  });

  if (isLoading) {
    return <Spin />;
  }

  if (error || !data) {
    notFound();
  }
  const handleClose = () => {
    router.back();
  };

  if (data) {
    console.log(data?.author?.avatars?.[0]?.url, 7777);
  }

  return (
    <div className="flex h-screen bg-black relative">
      <div className="relative flex-grow flex items-center justify-center">
        {data ? (
          <Image
            src={data?.photo?.url}
            alt="Detail"
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        ) : (
          <p>Image not found</p>
        )}
        <Button
          title="Đóng"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
        >
          X
        </Button>
      </div>
      <div className="hidden md:flex flex-col w-1/3 bg-gray-200 p-4 bg-white">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <Link href={`/profile/${data?.author?.id}`}>
              <Image
                src={data?.author?.avatars?.[0]?.url || "/image/avt.jpg"}
                alt="User Avatar"
                width={30}
                height={30}
                className="rounded-full mr-2"
              />
            </Link>
            <Link href={`/profile/${data?.author?.id}`}>
              <span className="ml-3 text-xl font-bold">
                {data?.author?.name}
              </span>{" "}
            </Link>
          </div>
        </div>
        <p
          className="mt-1 text-xs text-gray-500"
          title={moment(data.photo?.createdAt).format("DD/MM/YYYY HH:mm")}
        >
          {time(data.photo?.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
