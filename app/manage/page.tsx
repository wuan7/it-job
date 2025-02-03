"use client";

import { cvList } from "@/constants";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import ListCV from "./ListCV";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type cvUsers = {
  currentPage: number;
  totalPages: number;
  totalSubmissions: number;
  submissions: cvList[];
}
const ManagePage = () => {
  const [cvUsers, setCVUsers] = useState<cvUsers>({
    currentPage: 1,
    totalPages: 1,
    totalSubmissions: 0,
    submissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const getUserCV = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '5',
        });
        const res = await fetch(`/api/cv/recruiter?${queryParams}`);
        if (res.status === 404) {
          setCVUsers({
            currentPage: 1,
            totalPages: 1,
            totalSubmissions: 0,
            submissions: [],
          });
          return;
        }
        const data = await res.json();
        console.log("list cv ne", data.data);
        setCVUsers(data.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUserCV();
  }, [currentPage, status]);
  const handleCvResponse = async (
    id: string,
    cvUrl: string,
    userId: string,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/notification/response/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, userId }),
      });
      if (!response.ok)
        throw new Error("Lỗi khi cập nhật thông báo nhà tuyển dụng đã xem hồ sơ");
      const data = await response.json();
      setStatus(data.data.notification.status)
      if (status === "seen") {
        window.open(cvUrl, "_blank", "noopener noreferrer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật thông báo nhà tuyển dụng đã xem hồ sơ");
    }
  };
 
  return (
    <div className="max-w-6xl mx-auto py-10">
      <ListCV cvUsers={cvUsers.submissions} loading={loading} handleCvResponse={handleCvResponse}/>
      <div className="flex justify-center gap-4 mt-4">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          size="icon"
          className={cn(
            "bg-white rounded-full border border-primaryBlue hover:bg-transparent",
            currentPage === 1 && "pointer-events-none border-gray-500"
          )}
        >
          <ChevronLeft className={cn("size-7 text-primaryBlue", currentPage === 1 && "text-black")} />
        </Button>
        <span className="flex items-center justify-center text-sm">
          {currentPage} / {cvUsers?.totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          size="icon"
          className={cn(
            "bg-white rounded-full border border-primaryBlue hover:bg-transparent",
            currentPage === cvUsers.totalPages && "pointer-events-none border-gray-500"
          )}
        >
          <ChevronRight className={cn("size-7 text-primaryBlue", currentPage === cvUsers.totalPages && "text-black")} />
        </Button>
      </div>
    </div>
  );
};

export default ManagePage;
