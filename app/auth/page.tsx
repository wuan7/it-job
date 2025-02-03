import React from "react";
import Image from "next/image";
import Auth from "@/components/auth/Auth";

const page = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="w-full md:w-2/3 p-5 md:p-10">
        <div className="max-w-2xl mx-auto">
          <Auth />
        </div>
      </div>
      <div className="w-full md:w-1/3 p-5 h-[300px] md:fixed md:top-0 md:right-0 md:bottom-0 md:h-auto bg-gradient-to-b from-blue-600 to-sky-600">
        <div className="flex items-center">
          <Image src={"/logo-1.svg"} width={100} height={100} alt={"itjob"} />
          <h5 className="text-white text-3xl font-bold">IT Job</h5>
        </div>
        <h1 className="text-3xl text-white">Tiếp lợi thế nối thành công</h1>
        <p className="text-white">
          It Job - Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt
          Nam
        </p>
      </div>
    </div>
  );
};

export default page;
