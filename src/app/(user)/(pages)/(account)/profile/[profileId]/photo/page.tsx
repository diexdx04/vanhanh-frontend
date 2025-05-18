"use client";
import useApi from "@/api/useApi";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

interface ImageType {
  url: string;
  createdAt: Date;
  id: string;
  isAvt: boolean;
}

interface PhotoResponse {
  images: ImageType[];
}

const Page = () => {
  const params = useParams();
  const profileId = Number(params.profileId);
  const [page, setPage] = useState(1);
  const { api } = useApi();
  const [photos, setPhotos] = useState<ImageType[]>([]);
  const [isEndOfPhotos, setIsEndOfPhoto] = useState(true);
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await api("GET", `/profile/${profileId}`, {});
    },
    enabled: !!profileId,
  });

  const {
    data: photo,
    refetch,
    isLoading,
  } = useQuery<PhotoResponse>({
    queryKey: ["photo", page],
    queryFn: async () => {
      const response = await api(
        "GET",
        `/profile/${profileId}/photo?page=${page}&limit=12`,
        {}
      );
      if (response.images.length === 0) {
        setIsEndOfPhoto(false);
      }
      console.log(response, 99);

      return response;
    },
    enabled: profile?.isFollowing || !!profileId,
  });

  useEffect(() => {
    if (photo) {
      setPhotos((prev) => [...prev, ...photo.images]);
    }
  }, [photo]);

  const loadMorePhotos = () => {
    setPage((prevPage) => prevPage + 1);
    refetch();
  };

  return (
    <div>
      {profile?.data?.isPrivate && profile?.isFollowing === false ? (
        <div className="flex flex-col items-center mt-20">
          <div className="text-6xl mb-4">
            <FaLock />
          </div>
          <h1 className="text-xxsl">Đây là tài khoản riêng tư</h1>
          <p className="text-gray-500">
            Hãy theo dõi tài khoản này để xem thêm
          </p>
        </div>
      ) : (
        <div className="bg-gray-200 p-5">
          <div className="w-4/5 bg-white max-w-screen-md mx-auto rounded-md p-3">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Tất cả ảnh</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((img: ImageType, index: number) => (
                  <Link
                    key={index}
                    href={`/photo-detail?photoId=${img.id}&setA=${img.isAvt}`}
                  >
                    <div className="flex items-center justify-center bg-gray-200 h-44 cursor-pointer">
                      <Image
                        src={img.url}
                        alt=""
                        layout="responsive"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                      />
                    </div>
                  </Link>
                ))}
              </div>

              <Button
                onClick={loadMorePhotos}
                disabled={isLoading || !isEndOfPhotos}
                loading={isLoading}
                type="primary"
                style={{ marginTop: "20px" }}
              >
                Xem Thêm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
