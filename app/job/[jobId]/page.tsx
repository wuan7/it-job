"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Award,
  Box,
  CircleDollarSign,
  Clock,
  Heart,
  Hourglass,
  Loader,
  MapPin,
  RotateCw,
  Send,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import StickyBox from "react-sticky-box";
import { useParams } from "next/navigation";
import { cvList, jobPosts } from "@/constants";
import JobCard from "./JobCard";
import { useDialog } from "@/app/contexts/DialogContext";
import { toast } from "sonner";
import UploadDialog from "@/components/UploadDialog";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/app/contexts/UserContext";
const JobPage = () => {
  const { jobId } = useParams();
  const { openDialog } = useDialog("upload");
  const [job, setJob] = useState<jobPosts>({} as jobPosts);
  const [checkSubmitCV, setCheckSubmitCV] = useState<cvList | null>(null);
  const { user } = useUserContext();
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleApply = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để apply ");
      return;
    }
    if (user.role !== "user") {
      toast.warning("Vui lòng đăng nhập bằng tài khoản người dùng để apply ");
      return;
    }
    openDialog();
  };

  const checkAndGetLatestSubmission = async () => {
    if (!jobId && !user) return;
    const response = await fetch(`/api/cv/check-submit-cv/${jobId}`);
    if (!response.ok) {
      setCheckSubmitCV(null);
      return;
    }
    const data = await response.json();
    setCheckSubmitCV(data.data);
    return;
  };

  useLayoutEffect(() => {
    checkAndGetLatestSubmission();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [savedJobsResponse, jobResponse] = await Promise.all([
          fetch('/api/auth/save-job-ids'),
          fetch(`/api/job-post/${jobId}`)
        ]);

        if (!savedJobsResponse.ok || !jobResponse.ok) throw new Error('Failed to fetch saved jobs or job details');

        const savedJobsData = await savedJobsResponse.json();
        const jobData = await jobResponse.json();

        setJob({
          ...jobData.data,
          isSaved: savedJobsData.data.includes(jobData.data._id)
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]); 
  const handleToggleSavedJob = async (jobId: string) => {
    try {
      setLoadingSave(true);
      const response = await fetch(`/api/auth/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!response.ok) throw new Error("Lỗi khi lưu công việc");

      setJob((prevJob) => ({
        ...prevJob,
        isSaved: !prevJob.isSaved // Đảo ngược giá trị của isSaved
      }));
    } catch (error) {
      console.error("Lỗi khi lưu công việc", error);
      toast.error("Lỗi khi lưu công việc: " + error);
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-5">
        <div className="flex gap-x-5">
          <div className="w-full  md:w-2/3  rounded-sm">
            <Skeleton className="w-full  h-[150px] rounded-sm p-3 space-y-2 mb-5" />
            <Skeleton className="w-full  h-[500px] rounded-sm mt-5" />
          </div>
          <div className="hidden md:block md:w-1/3 h-[408px] rounded-sm ml-1">
            <Skeleton className="w-full  h-[110px] rounded-sm" />
            <Skeleton className="w-full  h-[290px] rounded-sm mt-5" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
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
    <>
      <UploadDialog job={job} />

      <div className="max-w-6xl mx-auto p-5">
        <div className="flex gap-x-5 items-start">
          <div className="w-full md:w-2/3">
            <div className="p-5 bg-white space-y-2">
              <h1 className="text-xl font-bold">{job.title}</h1>
              <div className="flex items-start md:items-center flex-col md:flex-row gap-3 md:gap-x-8 ">
                <div className="flex items-center gap-x-2">
                  <div className="bg-primaryBlue p-2 rounded-full">
                    <CircleDollarSign className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm">Mức lương</p>
                    <p className="font-semibold text-sm">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="bg-primaryBlue p-2 rounded-full">
                    <MapPin className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm">Địa điểm</p>
                    <p className="font-semibold text-sm">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="bg-primaryBlue p-2 rounded-full">
                    <Hourglass className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm">Kinh nghiệm</p>
                    <p className="font-semibold text-sm">{job.experience}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-2 flex items-center gap-x-1 w-fit rounded-md">
                <Clock className="text-primaryBlue size-4" />
                <p className="text-muted-foreground">
                  Hạn nộp hồ sơ:{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
              <div className="flex md:flex-row flex-col gap-2 md:gap-x-2">
                <Button
                  onClick={handleApply}
                  className="!text-white font-semibold bg-primaryBlue hover:bg-primaryBlue-light w-full"
                >
                  {checkSubmitCV ? <RotateCw /> : <Send />}
                  {checkSubmitCV ? "Ứng tuyển lại" : "Ứng tuyển ngay"}
                </Button>
                <Button
                  onClick={() => handleToggleSavedJob(job._id)}
                  className=" text-primaryBlue font-semibold !bg-white border border-primaryBlue hover:border-primaryBlue/50"
                >
                  {loadingSave ? (
                    <Loader className="animate-spin size-4" />
                  ) : (
                    <Heart
                      className={`cursor-pointer size-4 ${
                        job.isSaved ? "text-primaryBlue" : "text-blue-400"
                      }`}
                    />
                  )}
                  Lưu tin
                </Button>
              </div>
              {checkSubmitCV && (
                <div className="flex md:flex-row flex-col gap-2 md:gap-x-2">
                  <p className="text-muted-foreground">
                    Bạn đã gửi CV cho vị trí này vào ngày:{" "}
                    <span className="font-semibold text-black">
                      {new Date(checkSubmitCV.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                    .
                  </p>
                  <Link
                    className="text-primaryBlue font-semibold"
                    target="_blank"
                    href={checkSubmitCV.cvInfo.url}
                  >
                    Xem CV đã nộp
                  </Link>
                </div>
              )}
            </div>
            <div className="p-5 bg-white space-y-3 mt-5">
              <h1 className="text-xl font-bold border-l-4 border-primaryBlue pl-2">
                Chi tiết tuyển dụng
              </h1>
              <div>
                <h3 className="text-lg font-semibold">Mô tả công việc</h3>
                <ul className="pl-5 space-y-2">
                  {job.jobDescription?.map((item: string) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Yêu cầu ứng viên</h3>
                <ul className="pl-5 space-y-2">
                  {job.candidateRequirements?.map((item: string) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Quyền lợi</h3>
                <ul className="pl-5 space-y-2">
                  {job.benefits?.map((item: string) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Địa điểm làm việc</h3>
                <ul className="pl-5 space-y-2">
                  <li className="list-disc ">{job.workAddress}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Thời gian làm việc</h3>
                <ul className="pl-5 space-y-2">
                  <li className="list-disc ">{job.workTime}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Cách thức ứng tuyển</h3>
                <p>
                  Ứng viên nộp hồ sơ trực tuyến bằng cách bấm Ứng tuyển ngay
                  dưới đây.
                </p>
                <p>
                  Hạn nộp hồ sơ:{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
            </div>
            <div className="p-5 bg-white space-y-2">
              <h1 className="text-xl font-bold border-l-4 border-primaryBlue pl-2">
                Việc làm liên quan
              </h1>
              <JobCard category={job.category} id={job._id} />
            </div>
          </div>
          <StickyBox
            offsetTop={15}
            offsetBottom={10}
            className="hidden md:block w-1/3"
          >
            <div className="p-5 bg-white space-y-2">
              <div className="flex gap-x-2">
                <Image
                  className="object-contain flex items-center justify-center rounded-sm w-[70px] h-[70px]"
                  alt="logo"
                  width={70}
                  height={70}
                  src={job.createdBy?.logoInfo.url || ""}
                />
                <h1 className="font-semibold uppercase">
                  {job.createdBy?.companyName}
                </h1>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1">
                  <Users className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Quy mô:</p>
                </div>
                <p className="font-semibold text-sm">
                  {job.createdBy?.employeeCount}+ nhân viên
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1">
                  <Box className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Lĩnh vực:</p>
                </div>
                <p className="font-semibold text-sm">{job.field}</p>
              </div>
              <div className="flex items-center justify-start gap-x-3">
                <div className="flex items-center gap-x-1">
                  <MapPin className="size-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Địa điểm:</p>
                </div>
                <p className="font-semibold text-sm line-clamp-1">
                  {job.location}
                </p>
              </div>
            </div>
            <div className="p-5 bg-white space-y-4 mt-5">
              <h1 className="font-semibold ">Thông tin chung</h1>
              <div className="flex items-center gap-x-3">
                <div className="bg-primaryBlue p-2 rounded-full">
                  <Award className="text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Cấp bậc</p>
                  <p className="text-sm font-semibold">{job.positionLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="bg-primaryBlue p-2 rounded-full">
                  <Hourglass className="text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Kinh nghiệm</p>
                  <p className="text-sm font-semibold">{job.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="bg-primaryBlue p-2 rounded-full">
                  <Users className="text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Số lượng tuyển
                  </p>
                  <p className="text-sm font-semibold">{job.vacancies}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="bg-primaryBlue p-2 rounded-full">
                  <Clock className="text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Hình thức làm việc
                  </p>
                  <p className="text-sm font-semibold">{job.jobType}</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="bg-primaryBlue p-2 rounded-full">
                  <User className="text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Giới tính</p>
                  <p className="text-sm font-semibold">
                    {job.genderPreference}
                  </p>
                </div>
              </div>
            </div>
          </StickyBox>
        </div>
      </div>
    </>
  );
};

export default JobPage;
