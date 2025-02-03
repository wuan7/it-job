"use client";
import React from "react";
import Image from "next/image";
const ConversationsPage = () => {
  return (

      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col justify-center items-center">
          <Image src={"/no-conversation.png"} width={200} height={200} alt="" />
          <p className="text-muted-foreground text-xs mt-3">
            Bạn không có cuộc trò chuyện nào...
          </p>
        </div>
      </div>

  );
};

export default ConversationsPage;
