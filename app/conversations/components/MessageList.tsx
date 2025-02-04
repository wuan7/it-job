import Message from "./Message";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import { Message as MessageType } from "@/constants";
interface MessageListProps {
  messages: MessageType[];
}
const MessageList = ({ messages }: MessageListProps) => {
  const formatDateLable = (dateStr: Date) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Hôm nay";
    if (isYesterday(date)) return "Hôm qua";
    return format(date, "EEEE, d MMMM ", { locale: vi });
  };
  return (
    <div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-crollbar">
        <div>
          {messages &&
            messages.map((message, index) => {
              let showDate = false;

              if (
                index === 0 ||
                formatDateLable(messages[index - 1].createdAt) !==
                  formatDateLable(message.createdAt)
              ) {
                showDate = true;
              }
              return (
                <div key={message._id}>
                  {showDate && (
                    <div className="text-center my-2 relative">
                      <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                      <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                        {formatDateLable(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <Message message={message} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
