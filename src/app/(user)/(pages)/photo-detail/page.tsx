// src/app/(user)/(pages)/photo-detail/page.tsx
"use client";
import useApi from "@/api/useApi";
import { usePhoto } from "@/app/context/PhotoContext";
import { time } from "@/time/time";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import moment from "moment";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const PhotoDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const { api } = useApi();
  const { photoData } = usePhoto();
  const { createdAt, authorId, isAvatar } = photoData;

  const fetchProfile = async () => {
    const response = await api("GET", `/profile/${authorId}`, {});

    return response.data;
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
  const handleClose = () => {
    router.back();
  };

  return (
    <div className="flex h-screen bg-black relative">
      <div className="relative flex-grow flex items-center justify-center">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Detail"
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
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
            <Link href={`/profile/${authorId}`}>
              <Image
                src={data?.avatars?.[0]?.url || "/image/avt.jpg"}
                alt="User Avatar"
                width={30}
                height={30}
                className="rounded-full mr-2"
              />
            </Link>
            <Link href={`/profile/${authorId}`}>
              <span className="ml-3 text-xl font-bold">{data.name}</span>{" "}
            </Link>
          </div>
        </div>
        <p
          className="mt-1 text-xs text-gray-500"
          title={moment(createdAt).format("DD/MM/YYYY HH:mm")}
        >
          {time(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
