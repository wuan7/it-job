import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/constants";
interface HeaderProps {
  data: Conversation
}
const Header = ({data}: HeaderProps) => {
  return (
    <div className="flex p-2 gap-x-2">
      <Avatar>
        <AvatarImage
          src={data.employerId.logoInfo.url}
          alt="avatar"
          className="object-contain rounded-full border border-white"
        />
        <AvatarFallback>
          {data.employerId.companyName?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h5 className="text-sm font-semibold">{data.employerId.companyName}</h5>
        <p className="text-xs">{data.employerId.email}</p>
      </div>
    </div>
  );
};

export default Header;
