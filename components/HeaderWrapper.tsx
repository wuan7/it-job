"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./header/Navbar";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const noHeaderPaths = ["/auth", "/admin", "/conversations"];
  if (noHeaderPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return <Navbar />;
};

export default HeaderWrapper;
