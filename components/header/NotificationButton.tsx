import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Loader } from "lucide-react";
import { useSocket } from "@/app/contexts/SocketContext";
import { Notification } from "@/constants";
import { useUserContext } from "@/app/contexts/UserContext";
import Link from "next/link";
const NotificationButton = () => {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  useEffect(() => {
    if (!user || !socket) return;

    // Lắng nghe sự kiện "newCV"
    socket.on("newCV", (notification) => {
      console.log("🔔 CV nộp:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("cvResponseNotification", (notification) => {
      console.log("👀 CV response:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("newCV");
      socket.off("cvResponseNotification");
    };
  }, [socket, user]);
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      if (user.role === "recruiter") {
        try {
          setLoading(true);
          const response = await fetch("/api/notification/recruiter");
          const data = await response.json();

          console.log("notification",data);
          setNotifications(data.data.notifications);
          setUnreadCount(data.data.unreadCount);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          setLoading(true);
          const response = await fetch("/api/notification/user");
          const data = await response.json();

          console.log(data);
          setNotifications(data.data.notifications);
          setUnreadCount(data.data.unreadCount);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [user]);
  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notification/mark-read", {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to mark notifications as read");
      if (user?.role === "recruiter") {
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isReadByRecruiter: true }))
        );
      } else {
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isReadByUser: true }))
        );
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const toggleMarkRead = async (
    notificationId: string,
    isRead: boolean,
    type: string
  ) => {
    if (type === "recruiter") {
      try {
        const res = await fetch(`/api/notification/toggle-read/${notificationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isReadByRecruiter: !isRead }),
        });
        if (!res.ok) throw new Error("Failed to toggle notification read status");
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? { ...notif, isReadByRecruiter: !isRead }
              : notif
          )
        );

        // Cập nhật số lượng thông báo chưa đọc
        setUnreadCount((prev) => (isRead ? prev + 1 : prev - 1));
      } catch (error) {
        console.error("Failed to toggle notification read status:", error);
      }
    } else {
      try {
        const res = await fetch(`/api/notification/toggle-read/${notificationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isReadByUser: !isRead }),
        });
        if (!res.ok) throw new Error("Failed to toggle notification read status");
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? { ...notif, isReadByUser: !isRead }
              : notif
          )
        );

        // Cập nhật số lượng thông báo chưa đọc
        setUnreadCount((prev) => (isRead ? prev + 1 : prev - 1));
      } catch (error) {
        console.error("Failed to toggle notification read status:", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="relative rounded-full  w-10 h-10 flex justify-center items-center bg-white">
          <Bell className="text-primaryBlue size-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1.5 flex justify-center items-center text-xs p-1 w-5 h-5 bg-red-500 text-white rounded-full">
              {unreadCount}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-xs max-h-96 overflow-y-auto py-0">
        <DropdownMenuLabel className="flex justify-between sticky top-0 bg-white z-10">
          <h1 className="">Thông báo</h1>
          {notifications.length !== 0 && (
            <h3
              onClick={markAllAsRead}
              className="text-primaryBlue font-normal cursor-pointer"
            >
              Đánh dấu là đã đọc
            </h3>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading && (
          <div className="flex justify-center items-center  p-5">
            <Loader className="animate-spin size-8 text-primaryBlue" />
          </div>
        )}
        {!loading && notifications.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-2">
            <Image
              loading="lazy"
              src="/none-result.webp"
              alt="itjob"
              width={100}
              height={100}
            />
            <p className="text-muted-foreground text-sm">
              Bạn chưa có thông báo nào.
            </p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <DropdownMenuItem className="">
                  <div className="space-y-1 group">
                  <Link href={`/job/${notification.submissionId.jobPostId._id}`}>

                    <div className="cursor-pointer">
                      {user?.role === "recruiter" ? (
                        <h1 className="font-semibold group-hover:text-primaryBlue">
                          {notification.message}
                        </h1>
                      ) : (
                        <>
                          <h1 className="font-semibold group-hover:text-primaryBlue">
                            Nhà tuyển dụng{" "}
                            {notification.status === "seen" && "đã xem"}{" "}
                            {notification.status === "suitable" &&
                              "đã đánh giá phù hợp với"}{" "}
                            {notification.status === "not_suitable" &&
                              "đã đánh giá chưa phù hợp với"}{" "}
                            CV của bạn
                          </h1>
                          <p className="text-xs group-hover:text-primaryBlue">
                            {notification.submissionId.receivedBy.companyName}{" "}
                            vừa xem CV của bạn
                          </p>
                        </>
                      )}
                    </div>
                    </Link>
                    <div className="flex items-center justify-between">
                      {user?.role === "recruiter" ? (
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.responseTime).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      )}

                      <Check
                        className="text-primaryBlue size-4 cursor-pointer hidden group-hover:block"
                        onClick={
                          user?.role === "recruiter"
                            ? () =>
                                toggleMarkRead(
                                  notification._id,
                                  notification.isReadByRecruiter,
                                  "recruiter"
                                )
                            : () =>
                                toggleMarkRead(
                                  notification._id,
                                  notification.isReadByUser,
                                  "user"
                                )
                        }
                      />
                    </div>
                  </div>
                 
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationButton;
