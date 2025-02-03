import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUserContext } from "../contexts/UserContext";
import { Eye, EyeOff } from "lucide-react";

const ProfileForm = () => {
  const { user, fetchCurrentUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [updateP, setUpdateP] = useState(false);

  const applicantSchema = z.object({
    fullName: z.string().min(6, { message: "Họ và tên phải ít nhất 6 ký tự." }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    phone: z
      .string()
      .optional()
      .refine((value) => !value || /^\d{10}$/.test(value), {
        message: "Số điện thoại phải 10 số.",
      }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      .optional(),
    oldPassword: updateP
      ? z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      : z.string().optional(),
    newPassword: updateP
      ? z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      : z.string().optional(),
  });
  const recruiterSchema = z.object({
    companyName: z
      .string()
      .min(6, { message: "Tên công ty phải ít nhất 6 ký tự." }),
    address: z.string().min(5, { message: "Địa chỉ phải ít nhất 5 ký tự." }),
    description: z
      .string()
      .min(10, { message: "Mô tả phải ít nhất 10 ký tự." }),
    employeeCount: z
      .string()
      .min(1, { message: "Số lượng nhân viên phải ít nhất 1 ký tự." }),
    website: z.string().url({ message: "URL website phải hợp lệ." }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      .optional(),
    oldPassword: updateP
      ? z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      : z.string().optional(),
    newPassword: updateP
      ? z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." })
      : z.string().optional(),
  });
  const formSchema =
    user?.role === "recruiter" ? recruiterSchema : applicantSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      user?.role === "recruiter"
        ? {
            companyName: user?.companyName || "",
            address: user?.address || "",
            description: user?.description || "",
            employeeCount: user?.employeeCount?.toString() || "",
            website: user?.website || "",
            email: user?.email || "",
            password: user?.password || "",
          }
        : {
            fullName: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            password: user?.password || "",
          },
  });

  useEffect(() => {
    if (user) {
      const defaultValues =
        user.role === "recruiter"
          ? {
              companyName: user.companyName || "",
              address: user.address || "",
              description: user.description || "",
              employeeCount: user.employeeCount?.toString() || "",
              website: user.website || "",
              email: user.email || "",
              password: user?.password || "",
            }
          : {
              fullName: user.fullName || "",
              email: user.email || "",
              phone: user.phone || "",
              password: user?.password || "",
            };
      form.reset(defaultValues);
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      setLoading(true);
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }
      toast.success("Cập nhật thông tin thành công");
      setUpdateP(false);
      fetchCurrentUser();
    } catch (error) {
      console.log("Lỗi khi cập nhật người dùng", error);
      toast.error("Cập nhật thông tin thất bại " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Lỗi xác thực:", errors)
          )}
          className="space-y-8"
        >
          {user?.role === "recruiter" ? (
            <>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên công ty</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng nhân viên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn trang web</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input readOnly disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center ">
                  <FormLabel className="">Mật khẩu</FormLabel>

                  <p onClick={() => setUpdateP(!updateP)} className="text-xs text-red-500 cursor-pointer">{updateP ? "Hủy" : "Đổi mật khẩu"}</p>
                </div>
                <FormControl>
                <Input className="" disabled type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {updateP && (
            <>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu cũ</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type={showOld ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          onClick={() => setShowOld(!showOld)}
                          size={"icon"}
                          variant={"transparent"}
                          type="button"
                          className="absolute right-2 rounded-full hover:bg-transparent"
                        >
                          {showOld ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type={showNew ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          onClick={() => setShowNew(!showNew)}
                          size={"icon"}
                          variant={"transparent"}
                          type="button"
                          className="absolute right-2 rounded-full hover:bg-transparent"
                        >
                          {showNew ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-primaryBlue hover:bg-primaryBlue-light !text-white"
            variant={"transparent"}
            disabled={loading}
          >
            Lưu
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
