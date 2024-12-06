"use client";
import useApi from "@/api/useApi";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";

type FieldType = {
  title: string;
  content: string;
};

const Post = ({
  setRefreshAt,
}: {
  setRefreshAt: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const { api } = useApi();
  const token = localStorage.getItem("token");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async () => {
    setIsSubmit(true);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const submitPost = async () => {
      if (!isSubmit) return;

      try {
        const values = await form.validateFields();
        await api("POST", "posts/create", values);

        messageApi.open({
          type: "success",
          content: "Ban da chia se thanh cong!",
          duration: 3,
        });
        form.resetFields();
      } catch (error: any) {
        console.log(error, 55);
        if (error.response) {
          const { errorCode } = error.response.data;
          if (errorCode === "TOKEN_EXPIRED") {
            messageApi.error("Token het han vui long dang nhap lai");
          } else {
            messageApi.error("Khong the chia se!!!");
          }
        } else {
          messageApi.error("Khong the chia se!");
        }
      } finally {
        setIsSubmit(false);
        setRefreshAt(new Date());
      }
    };

    submitPost();
  }, [isSubmit, form, messageApi, token, setRefreshAt, api]);

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="create-post"
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input your content!" }]}
        >
          <Input.TextArea placeholder="Enter post content" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: "right" }}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Post;
