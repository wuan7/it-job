import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader } from 'lucide-react';
import Link from 'next/link';
import { cvList } from '@/constants';
import { cn } from '@/lib/utils';

interface ListCVProps {
    handleCvResponse: (id: string, url: string, userId: string, status: string) => void;
    cvUsers: cvList[];
    loading: boolean;
}
const ListCV = ({cvUsers, loading, handleCvResponse}: ListCVProps) => {
  return (
    <Table className="border w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Trang thái</TableHead>
            <TableHead>CV</TableHead>
            <TableHead>Ngày nộp</TableHead>
            <TableHead>Công việc</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
        {loading && (
          <TableRow>
          <TableCell colSpan={8} >
            <div className="flex justify-center items-center">
              <Loader className="animate-spin size-8 text-primaryBlue" />
            </div>
          </TableCell>
        </TableRow>
    
      )}
          {cvUsers.map((cv) => (
            <TableRow key={cv._id}>
              <TableCell className="font-medium">{cv.email}</TableCell>
              <TableCell>{cv.fullName}</TableCell>
              <TableCell>{cv.phone}</TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  cv.status === "pending"
                    ? "text-gray-600"
                    : cv.status === "seen"
                    ? "text-black"
                    : cv.status === "suitable"
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {cv.status === "pending"
                  ? "Chưa xem"
                  : cv.status === "seen"
                  ? "Đã xem"
                  : cv.status === "suitable"
                  ? "Phù hợp"
                  : "Chưa phù hợp"}
              </TableCell>
              <TableCell className="text-primaryBlue" onClick={() => handleCvResponse(cv._id, cv.cvInfo.url, cv.createdBy._id, "seen")}>
              Xem CV
              </TableCell>
              <TableCell>
                {new Date(cv.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <Link
                  target="_blank"
                  href={`/job/${cv.jobPostId._id}`}
                  className="text-primaryBlue"
                >
                  {cv.jobPostId.title}
                </Link>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className='outline-none '>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Đánh giá CV</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCvResponse(cv._id, cv.cvInfo.url, cv.createdBy._id, "suitable")}>Phù hợp</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCvResponse(cv._id, cv.cvInfo.url, cv.createdBy._id, "not_suitable")}>Chưa phù hợp</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCvResponse(cv._id, cv.cvInfo.url, cv.createdBy._id, "seen")}>Đã xem</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
  )
}

export default ListCV