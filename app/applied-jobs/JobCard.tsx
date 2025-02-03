"use client";
import { CircleDollarSign, Eye, Loader } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { cvList } from "@/constants";
import Link from "next/link";

const JobCard = () => {
  const [cvUser, setCVUser] = useState<cvList[] | []>([]);
  const [loading, setLoading] = useState(false);
  console.log("cvuser", cvUser);
  const getUserCV = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cv/user");
      if (res.status === 404) {
        setCVUser([]);
        return;
      }
      const data = await res.json();
      console.log("list cv", data.data);
      setCVUser(data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    getUserCV();
  }, [getUserCV]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader className="animate-spin size-8 text-primaryBlue" />
      </div>
    );
  }

  if (!cvUser) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <Image
          loading="lazy"
          src="/none-result.webp"
          alt="itjob"
          width={200}
          height={200}
        />
        <p className="text-xs ">Bạn chưa ứng tuyển công việc nào!</p>
      </div>
    );
  }
  return (
    <div className="mt-5 flex flex-col gap-y-3 max-w-4xl">
      {cvUser.map((job: cvList) => {
        return (
          <div
            key={job.jobPostId._id}
            className="bg-white p-5 flex gap-x-2  group border hover:border-primaryBlue rounded-sm"
          >
            <Image
              className="border rounded-sm w-[100px] h-[100px] object-contain"
              src={job.jobPostId.createdBy.logoInfo.url}
              alt="logo"
              width={100}
              height={100}
            />
            <div className="space-y-1">
              <Link
                href={`/job/${job.jobPostId._id}`}
                className="font-semibold text-lg line-clamp-2 group-hover:text-primaryBlue"
              >
                {job.jobPostId.title}
              </Link>
              <div className="flex items-center gap-x-1">
              <CircleDollarSign className="text-primaryBlue size-4"/>
              <p className="text-primaryBlue font-semibold text-sm"> 
                {job.jobPostId.salary}
              </p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {job.jobPostId.createdBy.companyName}
              </p>
              <p className="text-sm">
                Thời gian ứng tuyển:{" "}
                {new Date(job.createdAt).toLocaleString(
                  "vi-VN",
                  {
                    
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
              <div className="flex items-center flex-wrap gap-x-2">
                <p className="text-sm">CV đã ứng tuyển {job.cvInfo.fileName}</p>
                <Link target="_blank" href={job.cvInfo.url} className="flex items-center gap-x-1">
                    <Eye className="text-primaryBlue size-5" />
                    <p  className="text-sm text-primaryBlue">Xem CV</p>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobCard;
