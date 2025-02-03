import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/Hint";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
interface MessageProps {
  message: {
    senderId: {
      avatarInfo: {
        url: string;
      },
      fullName: string;
      _id: string;
    }
    content: string;
    createdAt: Date;
  }
 
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Hôm nay" : isYesterday(date) ? "Hôm qua" : format(date, "EEEE, d MMMM yyyy", { locale: vi })} lúc ${format(date, "h:mm", { locale: vi })}`;
};

const Message = ({message } : MessageProps) => {

  
  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={message.senderId.avatarInfo.url} />
              <AvatarFallback>{ message.senderId.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
            
              <button className="font-bold text-primary hover:underline">
                {message.senderId.fullName}
              </button>
              <span>&nbsp;&nbsp;</span>

              <Hint label={formatFullTime(new Date(message.createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
              {format(new Date(message.createdAt), "hh:mm")}
              </button>
              </Hint>
              <div className="flex flex-col w-full">
              <p>{message.content}</p>           
          </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
