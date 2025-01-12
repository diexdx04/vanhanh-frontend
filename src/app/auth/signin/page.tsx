"use client";
import Cookies from "js-cookie";
import { instance } from "@/api/instance";
import { Button, Form, FormProps, Input, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type FieldType = {
  password?: string;
  email: string;
};

const Page: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState<FieldType>({
    password: "",
    email: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setFormData(values);
    setIsSubmit(true);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const submitForm = async () => {
      try {
        const response = await instance.post("/auth", formData);
        console.log(response, 3333);
        messageApi.success("dang nhap thanh cong!");

        const refreshToken = response.data.data.refreshToken;
        Cookies.set("refreshToken", refreshToken, { expires: 90 });
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userId", response.data.data.userId);

        router.push("/news");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error, 44);
          const messageErr = error.response?.data.userMessage;
          messageApi.error(messageErr);
        } else {
          console.error("loi khong xac dinh:", error);
          messageApi.error("Dang nhap that bai");
        }
      } finally {
        setIsSubmit(false);
      }
    };

    if (isSubmit) {
      submitForm();
    }
  }, [isSubmit, formData, messageApi, router]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {contextHolder}
        <h1 className="text-2xl font-bold mb-6">Dang nhap</h1>
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
              { required: true, message: "vui long khong de trong" },
              {
                type: "email",
                message: "chua dung dinh dang email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "vui long khong de trong" },
              {
                min: 6,
                message: "mat khau phai it nhat 6 ky tu",
              },
              {
                max: 20,
                message: "mat khau khong duoc dai qua 20 ky tu",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Dang Nhap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Page;
