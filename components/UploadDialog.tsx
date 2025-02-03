"use client";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/app/contexts/DialogContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Folder } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import PDFUpload from "./PDFUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cvList, jobPosts } from "@/constants";
import { Textarea } from "./ui/textarea";

interface UploadDialogProps {
  job: jobPosts;
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ tên phải ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  coverLetter: z.string().min(10, {
    message: "Nội dung  phải ít nhất 10 ký tự.",
  }),
  phone: z.string().regex(/^\d{10}$/, {
    message: "Số điện thoại phải 10 số.",
  }),
  type: z.enum(["latest", "old", "other"], {
    required_error: "Vui lòng chọn CV ứng tuyển",
  }),
});

const UploadDialog = ({ job }: UploadDialogProps) => {
  const { isOpen, closeDialog } = useDialog("upload");
  const [cvLatest, setCVLatest] = useState<cvList | null>(null);
  const [oldCV, setOldCV] = useState<cvList | null>(null);
  const [cvUser, setCVUser] = useState<cvList[] | []>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
    },
  });
  const getCVLatest = useCallback(async () => {
    try {
      const res = await fetch("/api/cv/latest");
      if (res.status === 404) {
        setCVLatest(null);
        return;
      }
      const data = await res.json();
      console.log(data);
      setCVLatest(data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.status === 401) {
        toast.error("Vui lòng đăng nhập");
        router.push("/auth");
      }
    }
  }, [router]);
  const getUserCV = useCallback(async () => {
    try {
      const res = await fetch("/api/cv/user");
      if (res.status === 404) {
        setCVUser([]);
        return;
      }
      const data = await res.json();
      console.log(res.status);
      console.log("list cv", data);
      setCVUser(data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    if (isOpen) {
      getCVLatest();
      getUserCV();
    }
  }, [isOpen, getCVLatest, getUserCV]);

  const handleCVUrl = (cv: cvList) => {
    setOldCV(cv);
    toast.success("Đã chọn cv");
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   
    if (values.type === "latest") {

      if (!cvLatest) {
        toast.error(
          "Vui lòng tải lên CV mới, bạn không có cv ứng tuyển nào gần đây"
        );
        return;
      }
      try {
        setLoading(true);
        const data = {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          coverLetter: values.coverLetter,
          receivedBy: job.createdBy._id,
          jobPostId: job._id,
          cvInfo: {
            publicId: cvLatest.cvInfo.publicId,
            url: cvLatest.cvInfo.url,
            fileName: cvLatest.cvInfo.fileName,
          },
        };
        console.log(data)
        const response = await fetch(`/api/cv/submit-cv`, {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success("Đã gửi cv ứng tuyển");
        form.reset();
        closeDialog();
      } catch (error) {
        console.log("Error submitting CV:", error);
      } finally {
        setLoading(false);
      }
    }

    if (values.type === "old") {
      if (!oldCV) {
        toast.error("Vui lòng chọn CV trong thư viện CV");
        return;
      }
      try {
        setLoading(true);
        const data = {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          coverLetter: values.coverLetter,
          receivedBy: job.createdBy._id,
          jobPostId: job._id,
          cvInfo: {
            publicId: oldCV.cvInfo.publicId,
            url: oldCV.cvInfo.url,
            fileName: oldCV.cvInfo.fileName,
          },
        };
        const response = await fetch(`/api/cv/submit-cv`, {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast.success("Đã gửi cv ứng tuyển");
        form.reset();
        closeDialog();
      } catch (error) {
        console.log("Error submitting CV:", error);
      } finally {
        setLoading(false);
      }
    }

    if (values.type === "other") {
      if (files.length <= 0) {
        toast.error("Vui lòng tải lên CV");
        return;
      }
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("coverLetter", values.coverLetter);
        formData.append("jobPostId", job._id);
        formData.append("receivedBy", job.createdBy._id);

        if (files.length > 0) { 
          formData.append("file", files[0]);
        }
        const response = await fetch("/api/cv/submit-cv", {
          method: "POST",
          body: formData,
         
        });

        if (!response.ok) {
          throw new Error("Failed to submit CV");
        }

        const result = await response.json();
        console.log("CV submitted successfully:", result);
        toast.success("Gửi cv ứng tuyển thành công");
        form.reset();
        closeDialog();
      } catch (error) {
        console.log("Error submitting CV:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ứng tuyển</DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-x-2 my-3">
                            <Folder className="text-primaryBlue" />
                            <h1 className="font-semibold">
                              Chọn CV để ứng tuyển
                            </h1>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <Accordion type="single" collapsible>
                              <AccordionItem value="item-1">
                                <AccordionTrigger className="underline-none">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="latest"
                                      id="latest"
                                    />
                                    <Label
                                      htmlFor="latest"
                                      className="font-semibold"
                                    >
                                      CV ứng tuyển gần đây nhất
                                    </Label>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="p-2 border rounded-md flex items-center space-x-2 group">
                                    {cvLatest ? (
                                      <div className="flex items-center gap-x-2">
                                        <Image
                                          src={"/pdf.svg"}
                                          width={50}
                                          height={50}
                                          alt={"pdf"}
                                        />
                                        <p>{cvLatest.cvInfo.fileName}</p>
                                        <Link
                                          href={cvLatest.cvInfo.url || ""}
                                          target="_blank"
                                          className="text-primaryBlue"
                                        >
                                          Xem
                                        </Link>
                                      </div>
                                    ) : (
                                      <div className="text-sm font-medium">Chưa có CV ứng tuyển nào gần đây</div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-2">
                                <AccordionTrigger>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="old" id="old" />
                                    <Label
                                      htmlFor="old"
                                      className="font-semibold"
                                    >
                                      Chọn CV khác trong thư viện CV của tôi
                                    </Label>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div>
                                    <h4 className="font-semibold">
                                      CV đã tải lên
                                    </h4>
                                    {cvUser && cvUser.length > 0 ? (
                                      cvUser?.map((cv) => (
                                        <div
                                          key={cv._id}
                                          className="p-2 border rounded-md flex items-center space-x-2 group"
                                        >
                                          <div className="flex items-center gap-x-2">
                                            <Image
                                              src={"/pdf.svg"}
                                              width={50}
                                              height={50}
                                              alt={"pdf"}
                                            />
                                            <p>{cv.cvInfo.fileName}</p>
                                            <Link
                                              href={cv.cvInfo.url || ""}
                                              target="_blank"
                                              className="text-primaryBlue"
                                            >
                                              Xem
                                            </Link>
                                          </div>
                                          <Button
                                            type="button"
                                            onClick={() => handleCVUrl(cv)}
                                            className="bg-primaryBlue hover:bg-primaryBlue-light  text-xs rounded-md cursor-pointer !text-white"
                                          >
                                            Chọn CV
                                          </Button>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm font-medium">Không có CV nào trong danh sách</div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-3">
                                <AccordionTrigger>
                                  <div className="flex  space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label
                                      htmlFor="other"
                                      className="font-semibold"
                                    >
                                      Tải lên CV từ máy tính
                                    </Label>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div>
                                    <PDFUpload
                                      files={files}
                                      setFiles={setFiles}
                                    />
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thư giới thiệu</FormLabel>
                        <FormControl>
                          <Textarea disabled={loading} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      className="bg-slate-200 hover:bg-slate-300 text-black"
                      onClick={closeDialog}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-primaryBlue hover:bg-primaryBlue-light text-white"
                      disabled={loading}
                    >
                      Nộp hồ sơ ứng tuyển
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
