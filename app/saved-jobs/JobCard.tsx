import { jobPosts } from "@/constants";
import { Heart, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const JobCard = () => {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [jobList, setJobList] = useState<jobPosts[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/save-job`);
      if (!response.ok) throw new Error("Failed to fetch saved jobs");

      const data = await response.json();
      setJobList(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobIds = async () => {
    try {
      const response = await fetch(`/api/auth/save-job-ids`);
      const data = await response.json();
      setSavedJobIds(data.data);
    } catch (error) {
      console.error("Không thể lấy trạng thái công việc", error);
    }
  };

  useEffect(() => {
    fetchSavedJobIds();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    if (jobList && jobList.length > 0 && savedJobIds.length > 0) {
      const updatedJobList = jobList.map((job) => ({
        ...job,
        isSaved: savedJobIds.includes(job._id),
      }));
      setJobList(updatedJobList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedJobIds]);

  const handleToggleSavedJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/auth/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!response.ok) throw new Error("Lỗi khi lưu công việc");

      setJobList((prev) =>
        prev.filter((job) => job._id !== jobId)
      );

      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin size-8 text-primaryBlue" />
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
        <p className="text-xs">Bạn chưa lưu công việc nào!</p>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-y-3 max-w-4xl">
      {jobList.map((job: jobPosts) => (
        <div
          key={job._id}
          className="bg-white p-3 md:p-5 flex flex-col md:flex-row gap-y-2 md:gap-x-2 group border hover:border-primaryBlue rounded-sm"
        >
          <Image
            className="border rounded-sm w-20 h-20 md:w-[100px] md:h-[100px] object-contain"
            src={job.createdBy.logoInfo.url}
            alt="logo"
            width={100}
            height={100}
          />
          <div className="space-y-1">
            <Link
              href={`/job/${job._id}`}
              className="font-semibold text-lg line-clamp-1 group-hover:text-primaryBlue break-words"
            >
              {job.title}
            </Link>
            <p className="text-primaryBlue font-semibold text-sm">
              {job.salary}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {job.createdBy.companyName}
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-slate-200 p-1 md:w-fit rounded-md flex items-center justify-center">
                <p className="text-muted-foreground text-xs truncate">
                  {job.location}
                </p>
              </div>
              <div className="p-1 md:w-fit flex items-center justify-center rounded-md cursor-pointer px-2">
                <Heart
                  onClick={() => handleToggleSavedJob(job._id)}
                  className={`cursor-pointer size-4 text-primaryBlue `}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobCard;
