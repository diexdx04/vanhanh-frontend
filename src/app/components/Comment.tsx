import { socket } from "@/api/instance";
import useApi from "@/api/useApi";
import { time } from "@/time/time";
import { Dropdown, Space, Popconfirm, message, Form, Input } from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";

moment.locale("vi");

type Comment = {
  id: number;
  name: string;
  content: string;
  createAt: Date;
  userId: number;
};

type CommentTableProps = {
  postId: number;
};

const Comment: React.FC<CommentTableProps> = ({ postId }) => {
  const { api } = useApi();
  const [comments, setComments] = useState<Comment[]>([]);
  const [ediCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const currentUserId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api("GET", `/posts/${postId}/comment`, {});
        setComments(response.comments);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };
    fetchComments();
  }, [postId]);

  useEffect(() => {
    socket.on("newComment-" + postId, (newComment) => {
      setComments((prev) => [newComment, ...prev]);
    });
    return () => {
      socket.off("newComment-" + postId);
    };
  }, [postId]);

  const handleSubmitComment = async (values: any) => {
    console.log(values, 6666);

    try {
      await api("POST", `/posts/${postId}/comment`, {
        content: values.newComment,
      });

      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi đăng bình luận:", error);
    }
  };

  const handleEditComment = async () => {
    if (ediCommentId !== null && editCommentContent.trim()) {
      try {
        await api("PUT", `/posts/${postId}/comment/${ediCommentId}`, {
          content: editCommentContent,
        });
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === ediCommentId
              ? { ...comment, content: editCommentContent }
              : comment
          )
        );
        setEditCommentId(null);
        setEditCommentContent("");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errorComment = error.response?.data.userMessage;
          messageApi.error(errorComment);
        } else {
          messageApi.error("Lỗi cmt!");
        }
      }
    }
  };

  const handleOptions = async (key: string, commentId: number) => {
    switch (key) {
      case "delete":
        try {
          await api("DELETE", `/posts/${postId}/comment/${commentId}`, {});
          // setComments((prev) =>
          //   prev.filter((comment) => comment.id !== commentId)
          // );
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const errorDelete = error.response?.data.userMessage;
            messageApi.error(errorDelete);
          } else {
            messageApi.error("Xóa bình luận thất bại");
          }
        }
        break;

      case "edit":
        setEditCommentId(commentId);
        const commentToEdit = comments.find(
          (comment) => comment.id === commentId
        );
        if (commentToEdit) {
          setEditCommentContent(commentToEdit.content);
        }
        break;

      case "report":
        console.log(`Báo cáo bình luận: ${commentId}`);
        break;

      default:
        console.log("Hành động không hợp lệ");
        break;
    }
  };

  const getMenuItems = (userId: number, commentId: number) => {
    const items = [];
    if (userId === currentUserId) {
      items.push({
        label: (
          <Popconfirm
            title="Chắc chưa?"
            onConfirm={() => handleOptions("delete", commentId)}
            okText="Có"
            cancelText="Không"
          >
            <a>Xóa</a>
          </Popconfirm>
        ),
        key: "delete",
      });

      items.push({
        label: "Chỉnh sửa",
        key: "edit",
        onClick: () => handleOptions("edit", commentId),
      });
    } else {
      items.push({
        label: "Báo cáo",
        key: "report",
        onClick: () => handleOptions("report", commentId),
      });
    }
    return items;
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 flex flex-col h-full">
      {contextHolder}
      <div style={{ paddingBottom: "25px", flexGrow: 1, overflow: "hidden" }}>
        {comments.length === 0 ? (
          <p>Chưa có bình luận</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-none border-gray-300 py-2">
              {ediCommentId === comment.id ? (
                <div className="flex items-center">
                  <div
                    className="bg-gray-100 rounded-lg p-2 w-full"
                    style={{ border: "none" }}
                  >
                    <Input.TextArea
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      onPressEnter={handleEditComment}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{
                        width: "100%",
                        resize: "none",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        padding: 0,
                      }}
                    />
                    <span
                      className="mr-auto cursor-pointer"
                      onClick={handleEditComment}
                      style={{ fontSize: "24px" }}
                    >
                      ➤
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div
                    className="bg-gray-100 border border-gray-300 rounded-lg p-2"
                    style={{ maxWidth: "90%", wordWrap: "break-word" }}
                  >
                    <p className="font-semibold">{comment.name}</p>
                    <p>{comment.content}</p>
                  </div>
                  <div className="relative ml-2">
                    <Dropdown
                      menu={{
                        items: getMenuItems(comment.userId, comment.id),
                      }}
                      trigger={["click"]}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>...</Space>
                      </a>
                    </Dropdown>
                  </div>
                </div>
              )}

              <div className="flex items-center ml-2">
                <p className="text-gray-500 text-sm">
                  {time(comment.createAt)}
                </p>
                <button className="ml-4 hover:underline">Thích</button>
                <button className="ml-4 hover:underline">Phản hồi</button>
              </div>
            </div>
          ))
        )}
      </div>
      <Form
        form={form}
        onFinish={handleSubmitComment}
        className="absolute bottom-4 left-4 right-4 "
      >
        <Form.Item
          name="newComment"
          rules={[
            {
              max: 300,
              message: "Bình luận quá dài ",
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Nhập bình luận của bạn..."
            className="border rounded-lg"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Comment;
