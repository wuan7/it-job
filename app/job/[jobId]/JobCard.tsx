import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useApi } from '@/hooks/useApi';
import { jobPosts } from '@/constants';
import Link from "next/link";
interface JobCardProps {
  category: string;
  id: string
}
const JobCard = ({category, id}: JobCardProps) => {
  const fetchJobPostDetailt = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/job-post/relate?category=${category}&jobPostId=${id}&limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch job posts');
      }
      const data = await response.json();
      return data.data;
      
    } catch (error) {
      console.log(error)
    }
  }, [category, id]); 
  const { data : jobs, loading, error } = useApi(fetchJobPostDetailt);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader className="animate-spin size-8 text-primaryBlue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-red-500">Đã có lỗi xảy ra: {error.message}</p>
      </div>
    );
  }

  if (!jobs) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <Image
          loading="lazy"
          src="/none-result.webp"
          alt="itjob"
          width={200}
          height={200}
        />
        <p className="text-xs ">Không có dữ liệu</p>
      </div>
    );
  }
  return (
    <div className="mt-5 flex flex-col gap-y-3">
  {jobs.map((job: jobPosts) => {
    const targetDate = new Date(job.applicationDeadline);
    const currentDate = new Date();
    const differenceInMillis = targetDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(differenceInMillis / (1000 * 3600 * 24));
    return (
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
          <p className="text-primaryBlue font-semibold text-sm">{job.salary}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {job.createdBy.companyName}
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-200 p-1 md:w-fit rounded-md">
              <p className="text-muted-foreground text-xs line-clamp-1">
                Còn {daysRemaining} ngày để ứng tuyển
              </p>
            </div>
            <div className="bg-slate-200 p-1  md:w-fit rounded-md">
              <p className="text-muted-foreground text-xs truncate">
                {job.location}
              </p>
            </div>
           
          </div>
        </div>
      </div>
    )
  })}
</div>

  );
};

export default JobCard;
