"use client";
import useApi from "@/api/useApi";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, MenuProps, Spin } from "antd";
import Search from "antd/es/input/Search";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";

const Header = () => {
  const { api } = useApi();
  const router = useRouter();

  const fetchUser = async () => {
    const response = await api("GET", "/user", {});
    if (!response || !response.name) {
      throw new Error("User data not found.");
    }
    console.log(response, 9999);

    return response;
  };

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    console.log("Loading user data...");
  }

  if (error) {
    console.error("Error:", error);
  }

  const handleLogout = () => {
    console.log("dang xuat");

    Cookies.remove("refreshToken");
    router.push("/signin");
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Link href={`/profile/${user?.id}`}>
          <div className="flex items-center">
            {isLoading ? (
              <Spin />
            ) : user ? (
              <>
                <h2>{user.name}</h2>
              </>
            ) : (
              <span>Người dùng</span>
            )}
          </div>
        </Link>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: "Cài đặt và quyền riêng tư",
      key: "1",
    },
    {
      label: (
        <span onClick={() => handleLogout()} className="cursor-pointer">
          Đăng Xuất
        </span>
      ),
      key: "2",
    },
  ];

  return (
    <header className="fixed sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-800">
      <nav className="lg:px-6 py-2.5">
        <div className="flex items-center max-w-screen-xl">
          <Button
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-none mr-2"
          >
            <Image
              src="/image/logo.jpg"
              alt="Logo"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </Button>

          <Search
            placeholder="Tìm kiếm người dùng, bài viết, ..."
            className="h-8 rounded-full"
            style={{ maxWidth: "250px" }}
          />

          <div className="flex items-center space-x-16 ml-32">
            <Link
              title="Trang chủ"
              href="/news"
              className="flex items-center text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white text-2xl mr-4"
            >
              <FaHome />
            </Link>
            <Link
              title="Nhóm"
              href="#"
              className="flex items-center text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white text-2xl mr-4"
            >
              <FaUserFriends />
            </Link>
            <Link
              title="Thông báo"
              href="#"
              className="flex items-center text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white text-2xl"
            >
              <IoNotifications />
            </Link>
          </div>

          <Dropdown menu={{ items }} trigger={["click"]}>
            <div className="flex items-center lg:order-2 ml-auto relative">
              <Button
                onClick={(e) => e.preventDefault()}
                title="Tài khoản"
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 relative"
              >
                <Image
                  src={user?.avatars?.[0]?.url}
                  alt="User Avatar"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </Button>
              <div className="absolute right-[-6px] bottom-0 z-10 flex items-center justify-center w-4 h-4 bg-white border-2 border-gray-300 rounded-full">
                <BiChevronDown className="text-gray-700 text-lg" />
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

export default Header;
