"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, FormProps, Input, message } from "antd";
import axios from "axios";
import { instance } from "@/api/instance";
import Link from "next/link";

type FieldType = {
  name?: string;
  password?: string;
  email: string;
  confirmPassword?: string;
};

const Page: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState<FieldType>({
    name: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("values:", values);
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
      const { confirmPassword, ...dataToSend } = formData;
      console.log(confirmPassword);

      try {
        await instance.post("/user/signup", dataToSend);
        messageApi.success("dang ki thanh cong!");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let errorMessage = "";
          if (error.response) {
            if (
              error.response.data &&
              typeof error.response.data === "object"
            ) {
              errorMessage = error.response.data.message || "da xay ra loi!";
            } else {
              errorMessage = error.response.data;
            }
          } else {
            errorMessage = error.message;
          }
          console.error("loi:", errorMessage);
          messageApi.error(errorMessage);
        } else {
          console.error("loi khong xac dinh:", error);
          messageApi.error("Dang ki that bai");
        }
      } finally {
        setIsSubmit(false);
      }
    };

    if (isSubmit) {
      submitForm();
    }
  }, [isSubmit, formData, messageApi]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {contextHolder}
        <h1 className="text-2xl font-bold mb-6">Dang ki</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[
              { required: true, message: "vui long khong de trong" },
              {
                min: 3,
                message: "ten phai co it nhat 3 ky tu",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "vui long khong de trong" },
              ({ getFieldValue }) => {
                return {
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("mat khau khong khop"));
                  },
                };
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Dang ki
            </Button>
          </Form.Item>
          <Link href="#">
            <div className="mt-4 text-gray-600 text-center">
              Ban da co tai khoan?
            </div>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Page;
