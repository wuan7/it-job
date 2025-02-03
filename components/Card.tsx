"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { jobPosts } from "@/constants";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface CardProps {
  jobs: {
    totalPages: number;
    jobPosts: jobPosts[];
  }
  loading: boolean;
  error: Error | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Card = ({ jobs, loading, error, currentPage, setCurrentPage }: CardProps) => {
  // State để lưu danh sách công việc đã lưu
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [jobList, setJobList] = useState<jobPosts[]>(jobs?.jobPosts || []);

  useEffect(() => {
    if(jobs?.jobPosts.length > 0) {
      const updatedJobList = jobs.jobPosts.map((job) => ({
        ...job,
        isSaved: savedJobs?.includes(job._id),
      }));
      setJobList(updatedJobList);
    }
  }, [jobs?.jobPosts, savedJobs]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await fetch(`/api/auth/save-job-ids`);
        const data = await response.json();
        setSavedJobs(data.data);
      } catch (error) {
        console.error("Không thể lấy trạng thái công việc", error);
      }
    };

    fetchSavedJobs();
  }, []);
  useEffect(() => {
    if (jobs && jobs?.jobPosts.length > 0 && savedJobs?.length > 0) {
      const updatedJobList = jobs.jobPosts.map((job) => ({
        ...job,
        isSaved: savedJobs.includes(job._id), // Kiểm tra nếu job đã lưu
      }));
      setJobList(updatedJobList);
    }
  }, [jobs, savedJobs]);
  
  const handleToggleSavedJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/auth/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!response.ok) throw new Error("Lỗi khi lưu công việc");
      console.log("response", response);
      // Cập nhật trạng thái của công việc
      setJobList((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        )
      );

      // Cập nhật danh sách công việc đã lưu
      if (savedJobs.includes(jobId)) {
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      } else {
        setSavedJobs((prev) => [...prev, jobId]);
      }

    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu công việc");
    }
  };

 

  if (loading) {
    return (
      <div className="my-5 flex flex-wrap gap-2 xl:justify-normal justify-center">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-[360px] h-[110px] bg-white group border rounded-sm flex items-center gap-x-2 p-2"
          >
            <Skeleton className="w-[78px] h-[78px] rounded-sm ml-1" />
            <div className="space-y-2">
              <Skeleton className="w-[78px] h-[14px] rounded-sm" />
              <Skeleton className="w-[78px] h-[14px] rounded-sm" />
              <div className="flex gap-x-1 items-center">
                <Skeleton className="w-[78px] h-[14px] rounded-sm" />
                <Skeleton className="w-[78px] h-[14px] rounded-sm" />
                <Skeleton className="w-[23px] h-[24px] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <p className="text-red-500">Đã có lỗi xảy ra: {error.message}</p>
      </div>
    );
  }

  if (!jobList || jobList.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <Image
          loading="lazy"
          src="/none-result.webp"
          alt="itjob"
          width={200}
          height={200}
        />
        <p className="text-xs">Không tìm thấy công việc</p>
      </div>
    );
  }

  return (
    <>
      <div className="my-5 flex flex-wrap gap-2 xl:justify-normal justify-center">
        {jobList.map((item: jobPosts) => (
          <div
            key={item._id}
            className="w-[360px] h-[110px] bg-white group border hover:border-primaryBlue rounded-sm flex items-center gap-x-2 p-1"
          >
            <Image
              loading="lazy"
              src={item.createdBy.logoInfo.url}
              alt="itjob"
              width={78}
              height={78}
              className="w-[78px] h-[78px] rounded-sm object-contain"
            />
            <div>
              <Link
                href={`/job/${item._id}`}
                className="font-semibold group-hover:text-primaryBlue line-clamp-1"
              >
                {item.title}
              </Link>
              <p className="text-xs line-clamp-1">{item.createdBy.companyName}</p>
              <div className="flex gap-x-1 items-center">
                <div className="bg-slate-100 p-1 rounded-sm text-xs font-semibold">
                  {item.salary}
                </div>
                <div className="bg-slate-100 p-1 rounded-sm text-xs font-semibold">
                  {item.location}
                </div>

                <Heart
                  onClick={() => handleToggleSavedJob(item._id)}
                  className={`cursor-pointer ml-auto pr-2 ${
                    item.isSaved ? "text-primaryBlue" : "text-gray-500"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
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
          {currentPage} / {jobs?.totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          size="icon"
          className={cn(
            "bg-white rounded-full border border-primaryBlue hover:bg-transparent",
            currentPage === jobs.totalPages && "pointer-events-none border-gray-500"
          )}
        >
          <ChevronRight className={cn("size-7 text-primaryBlue", currentPage === jobs.totalPages && "text-black")} />
        </Button>
      </div>
    </>
  );
};

export default Card;
