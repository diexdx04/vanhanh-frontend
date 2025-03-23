"use client";
import { socket } from "@/api/instance";
import useApi from "@/api/useApi";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin, Typography } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const { Title } = Typography;

const VerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Đang xác thực...");
  const [loading, setLoading] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const [messageApi, contextHolder] = useMessage();
  const [isVerified, setVerified] = useState<boolean | null>(null);
  const { api } = useApi();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socket.on("isVerified-" + userId, (isVerified) => {
      setVerified(isVerified);
    });
    return () => {
      socket.off("isVerified-" + userId);
    };
  }, [userId]);

  useEffect(() => {
    if (isVerified) {
      router.push("/news");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified]);

  useEffect(() => {
    const verifiCode = searchParams.get("verifyToken");
    const verifyToken = async () => {
      if (verifiCode) {
        try {
          await api("GET", `verify?verifyToken=${verifiCode}`, {});
          setStatus("Xác thực thành công!");
          setShowResend(false);
          setTimeout(() => {
            router.push("/news");
          }, 1500);
        } catch (error) {
          setStatus("Mã xác thực đã hết hạn hoặc không hợp lệ!");
          setShowResend(true);
          console.error(error);
        }
      } else {
        setStatus("Vui lòng kiểm tra email để xác thực tài khoản!");
        setShowResend(true);
      }
      setLoading(false);
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleResendCode = async () => {
    try {
      await api("POST", "verify", {});
      messageApi.success("Đã gửi lại mã xác thực!");
    } catch (error) {
      messageApi.error(
        "Không thể gửi mã xác thực. Vui lòng liên hệ với quản trị viên."
      );
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
      {loading ? (
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      ) : (
        <>
          <Title level={2} className="text-gray-800 text-center">
            {status}
          </Title>
          {showResend && (
            <Button type="primary" onClick={handleResendCode}>
              {contextHolder}
              Gửi lại mã xác thực
            </Button>
          )}
        </>
      )}
    </div>
  );
};

const VerificationPage = () => {
  return (
    <Suspense
      fallback={<Spin indicator={<LoadingOutlined spin />} size="large" />}
    >
      <VerificationContent />
    </Suspense>
  );
};

export default VerificationPage;
