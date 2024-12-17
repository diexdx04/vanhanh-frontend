"use client";
import { instance } from "@/api/instance";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Đang xác thực...");

  useEffect(() => {
    const token = searchParams.get("token");

    const verifyToken = async () => {
      if (token) {
        try {
          await instance.get(`/verify?token=${token}`);
          setStatus("Xac thuc thanh cong!");
        } catch (error) {
          setStatus("Xac Thuc that bai!");
          console.error(error);
        }
      } else {
        setStatus("Khong tim thay ma xac thuc! vui lng ktra lai lien ket");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl text-gray-800 text-center">{status}</h1>
    </div>
  );
};

export default VerificationPage;
