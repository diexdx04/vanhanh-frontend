"use client";
import Search from "antd/es/input/Search";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-800">
      <nav className="px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center max-w-screen-xl">
          <div className="flex items-center">
            <Link href="/news" className="flex items-center mr-4">
              <Image
                src="/image/logo.jpg"
                alt="Flowbite Logo"
                width={40}
                height={36}
                className="h-full"
              />
            </Link>
            <Search
              placeholder="Tìm kiếm người dùng, bài viết, ..."
              className="h-8 mr-4"
              style={{ minWidth: "200px" }}
            />

            <div className="flex items-center ml-4">
              <Link
                href="/news"
                className="flex items-center text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white text-2xl mr-16"
              >
                <FaHome />
              </Link>
              <Link
                href="#"
                className="flex items-center text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white text-2xl mr-16"
              >
                <FaUserFriends />
              </Link>
              <Link
                href="#"
                className="flex items-center text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white text-2xl"
              >
                <IoNotifications />
              </Link>
            </div>
          </div>
          <div className="flex items-center lg:order-2">
            <a
              href="#"
              className="text-gray-800 dark:text-white hover:bg-gray-50"
            >
              Log in
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
