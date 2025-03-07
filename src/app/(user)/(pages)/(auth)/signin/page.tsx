"use client";
import Cookies from "js-cookie";
import { instance } from "@/api/instance";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const Page: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await instance.post("/auth", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      messageApi.success("Đăng nhập thành công!");
      Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      if (!data.isVerified) {
        router.push("/verification");
      } else {
        router.push("/news");
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const messageErr = error.response?.data.userMessage;
        messageApi.error(messageErr);
      } else {
        messageApi.error("Đăng nhập thất bại");
      }
    },
  });

  const onFinish: FormProps<{ email: string; password: string }>["onFinish"] = (
    values
  ) => {
    mutation.mutate(values);
  };

  const onFinishFailed: FormProps<{
    email: string;
    password: string;
  }>["onFinishFailed"] = (errorInfo) => {
    console.log("Đã thất bại:", errorInfo);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {contextHolder}
        <h1 className="text-2xl font-bold mb-6">Đăng Nhập</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng không để trống" },
              { type: "email", message: "Chưa đúng định dạng email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật Khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng không để trống" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
              { max: 20, message: "Mật khẩu không được dài quá 20 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng Nhập
            </Button>
          </Form.Item>

          <Link href="/signup">Bạn chưa có tài khoản?</Link>
        </Form>
      </div>
    </div>
  );
};

export default Page;
