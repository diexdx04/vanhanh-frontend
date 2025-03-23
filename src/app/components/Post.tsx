"use client";
import useApi from "@/api/useApi";
import type { FormProps, UploadFile } from "antd";
import { Button, Form, Input, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Image from "next/image";

type FieldType = {
  content: string;
  fileList: UploadFile[];
};

const Post = () => {
  const { api } = useApi();
  const token = localStorage.getItem("token");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const onFinish: FormProps<FieldType>["onFinish"] = async () => {
    const values = await form.validateFields();

    if (!values.content.trim()) {
      messageApi.error("Nội dung không được để trống!");
      return;
    }

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
        const formData = new FormData();

        formData.append("content", values.content);

        const fileList = Array.isArray(values.fileList) ? values.fileList : [];
        fileList.forEach((file: UploadFile) => {
          const originFile = file.originFileObj;

          if (originFile) {
            formData.append("image", originFile);
          }
        });

        await api("POST", "posts", formData);

        messageApi.open({
          type: "success",
          content: "Bạn đã chia sẻ thành công!",
          duration: 3,
        });
        form.resetFields();
        setImageUrls([]);
      } catch (error) {
        console.log(error);
        messageApi.error("Không thể chia sẻ!");
      } finally {
        setIsSubmit(false);
      }
    };

    submitPost();
  }, [isSubmit, form, messageApi, token, api]);

  return (
    <div>
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
          name="content"
          rules={[{ required: true, message: "Please input your content!" }]}
        >
          <Input.TextArea placeholder="Bạn đang nghĩ gì?" rows={4} />
        </Form.Item>

        <Form.Item>
          <Form.Item name="fileList" valuePropName="fileList" noStyle>
            <Upload
              beforeUpload={() => false}
              multiple
              accept="image/*"
              onChange={(info) => {
                form.setFieldsValue({ fileList: info.fileList });
                const urls = info.fileList.map((file: UploadFile) =>
                  URL.createObjectURL(file.originFileObj!)
                );
                setImageUrls(urls);
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form.Item>

        <div style={{ marginTop: 16, display: "flex", gap: "8px" }}>
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`upload-${index}`}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: "right" }}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Post;
