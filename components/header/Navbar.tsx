"use client";
import React from "react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import Sidebar from "./Sidebar";
import { useUserContext } from "@/app/contexts/UserContext";
import NotificationButton from "./NotificationButton";
const Navbar = () => {
  const { user } = useUserContext();
 
  return (
    <nav className="overflow-hidden bg-primaryBlue">
      <div className="flex justify-between items-center max-w-6xl h-16 px-3 md:mx-auto py-4 ">
        <Link href="/" className="text-2xl font-bold text-white">
          IT Job
        </Link>
        <ul className="tyle-none items-center gap-x-5 hidden sm:flex">
          <li>
            <Link href="/" className="text-white/85 hover:text-white">
              Việc làm
            </Link>
          </li>
          {user ? (
            <>
            <li className="flex items-center">
              <NotificationButton />
            </li>
            {/* <li>
              <MessageButton />
            </li> */}
            <li className="flex items-center">
              <UserAvatar />
            </li>
            
            </>
          ) : (
            <li>
              <Link href="/auth" className="text-white/85 hover:text-white">
                Đăng nhập
              </Link>
            </li>
          )}
        </ul>
        <div className="sm:hidden">
          <Sidebar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
