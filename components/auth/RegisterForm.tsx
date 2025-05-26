"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Eye,
  EyeOff,
  Link,
  Mail,
  MapPinHouse,
  ReceiptText,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../ImageUpload";
import { Textarea } from "../ui/textarea";

interface RegisterFormProps {
  setState: (state: "login" | "register") => void;
}

const applicantSchema = z.object({
  fullName: z.string().min(6, { message: "Họ và tên phải ít nhất 6 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." }),
});

const recruiterSchema = z.object({
  companyName: z
    .string()
    .min(6, { message: "Tên công ty phải ít nhất 6 ký tự." }),
  address: z.string().min(5, { message: "Địa chỉ phải ít nhất 5 ký tự." }),
  description: z.string().min(10, { message: "Mô tả phải ít nhất 10 ký tự." }),
  employeeCount: z
    .string()
    .min(1, { message: "Số lượng nhân viên phải ít nhất 1 ký tự." }),
  website: z.string().url({ message: "URL website phải hợp lệ." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự." }),
});

export const RegisterForm = ({ setState }: RegisterFormProps) => {
  const [show, setShow] = useState(false);
  const [recruiterForm, setRecruiterForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<
    z.infer<typeof recruiterSchema | typeof applicantSchema>
  >({
    resolver: zodResolver(recruiterForm ? recruiterSchema : applicantSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      companyName: "",
      employeeCount: "",
      website: "",
      description: "",
      address: "",
    },
  });
  const onSubmit = async (
    values: z.infer<typeof recruiterSchema | typeof applicantSchema>
  ) => {
    console.log(values);

    if (recruiterForm) {
      if (files.length <= 0) {
        toast.error("Vui lòng tải lên logo công ty");
        return;
      }
      const recruiterValues = values as z.infer<typeof recruiterSchema>;
      const formData = new FormData();
      formData.append("companyName", recruiterValues.companyName);
      formData.append("address", recruiterValues.address);
      formData.append("description", recruiterValues.description);
      formData.append("employeeCount", recruiterValues.employeeCount);
      formData.append("website", recruiterValues.website);
      formData.append("email", recruiterValues.email);
      formData.append("password", recruiterValues.password);
      formData.append("type", "recruiter");
      if (files.length > 0) {
        formData.append("file", files[0]);
      }
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Something went wrong");
        }

        const data = await res.json();
        console.log("Register successful:", data);
        toast.success("Đăng ký tài khoản thành công");
        setState("login");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("error:", error);
        toast.error("Lỗi khi tạo tài khoản");
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Something went wrong");
        }

        const data = await res.json();
        console.log("Register successful:", data);
        toast.success("Đăng ký tài khoản thành công");
        setState("login");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message || "Something went wrong");
      }
    }
  };
  return (
    <Form {...form}>
      <h1 className="text-primaryBlue font-semibold text-2xl">
        Chào mừng bạn đã quay trở lại
      </h1>
      <p className="text-zinc-600 text-sm">
        Cùng IT Job tìm kiếm những cơ hội mới
      </p>

      {recruiterForm ? (
        <p
          className="text-primaryBlue text-sm cursor-pointer "
          onClick={() => {
            setRecruiterForm(false);
            form.reset(); // Reset lại các trường nếu chuyển đổi
          }}
        >
          Đăng ký với vai trò là ứng viên?
        </p>
      ) : (
        <p
          className="text-primaryBlue text-sm cursor-pointer "
          onClick={() => {
            setRecruiterForm(true);
            form.reset(); // Reset lại các trường nếu chuyển đổi
          }}
        >
          Đăng ký với vai trò là nhà tuyển dụng?
        </p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Mail className="absolute left-2 text-primaryBlue" />
                  <Input className="pl-10" {...field} disabled={isLoading} />
                </div>
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
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Shield className="absolute left-2 text-primaryBlue" />
                  <Input
                    className="pl-10"
                    type={show ? "text" : "password"}
                    {...field}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => setShow(!show)}
                    size={"icon"}
                    variant={"transparent"}
                    type="button"
                    className="absolute right-2 rounded-full hover:bg-transparent"
                    disabled={isLoading}
                  >
                    {show ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {recruiterForm ? (
          <>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên công ty</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-2 text-primaryBlue" />
                      <Input
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
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
                  <FormLabel>Địa chỉ công ty</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <MapPinHouse className="absolute left-2 text-primaryBlue" />
                      <Input
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
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
                  <FormLabel>Mô tả công ty</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <ReceiptText className="absolute left-2 text-primaryBlue" />
                      <Textarea
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
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
                    <div className="relative flex items-center">
                      <Users className="absolute left-2 text-primaryBlue" />
                      <Input
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
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
                  <FormLabel>Địa chỉ website</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Link className="absolute left-2 text-primaryBlue" />
                      <Input
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Hình ảnh công ty</FormLabel>
              <ImageUpload files={files} setFiles={setFiles} loading={isLoading}/>
            </FormItem>
          </>
        ) : (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <User className="absolute left-2 text-primaryBlue" />
                    <Input className="pl-10" {...field} disabled={isLoading} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          className="w-full bg-primaryBlue hover:bg-primaryBlue-light !text-white"
          variant={"transparent"}
          type="submit"
          disabled={isLoading}
        >
          Đăng ký
        </Button>
        
        <p className="text-center text-sm text-zinc-600">
          Bạn đã có tài khoản?{" "}
          <span
            onClick={() => setState("login")}
            className="text-primaryBlue cursor-pointer"
          >
            Đăng nhập ngay
          </span>
        </p>
      </form>
    </Form>
  );
};
