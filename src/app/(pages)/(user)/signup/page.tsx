"use client";
import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { instance } from "@/api/instance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type FieldType = {
  name?: string;
  password?: string;
  email: string;
  confirmPassword?: string;
};

const Page: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FieldType) => {
      console.log(data, 999);

      const { confirmPassword, ...dataToSend } = data;
      const response = await instance.post("/user", dataToSend);
      return response.data.data;
    },
    onSuccess: (data) => {
      Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      messageApi.success("Đăng ký thành công!");
      router.push("/verification");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        console.log(error, 8888);

        const errorComment = error.response?.data.userMessage;
        console.log(errorComment, 77777);

        messageApi.error(errorComment);
      } else {
        messageApi.error("Không thể đăng ký! Vui lòng thử lại sau!");
      }
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutation.mutate(values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Đã thất bại:", errorInfo);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {contextHolder}
        <h1 className="text-2xl font-bold mb-6">Đăng ký</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên người dùng"
            name="name"
            rules={[
              { required: true, message: "Vui lòng không để trống" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
            ]}
          >
            <Input />
          </Form.Item>
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
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng không để trống" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
              { max: 20, message: "Mật khẩu không được dài quá 20 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng không để trống" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng ký
            </Button>
          </Form.Item>
          <Link href="/signin">
            <div className="mt-4 text-center">Bạn đã có tài khoản?</div>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Page;
