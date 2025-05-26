"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner"
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
import { Eye, EyeOff, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";

interface LoginFormProps {
  setState: (state: "login" | "register") => void;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải ít nhất 6 ký tự.",
  }),
});

export const LoginForm = ({ setState }: LoginFormProps) => {
  const { fetchCurrentUser } = useUserContext();
  const router = useRouter()
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
        setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Something went wrong');
      }
  
      fetchCurrentUser();
      toast.success("Đăng nhập thành công");
      router.push('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Login failed:', error.message);
      toast.error(error.message || 'Đăng nhập thất bại');
    } finally {
        setLoading(false);
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
                  <Input className="pl-10" {...field} />
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
                  />
                  <Button
                    onClick={() => setShow(!show)}
                    size={"icon"}
                    variant={"transparent"}
                    type="button"
                    className="absolute right-2 rounded-full hover:bg-transparent"
                    
                  >
                    {show ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full bg-primaryBlue hover:bg-primaryBlue-light !text-white"
          variant={"transparent"}
          type="submit"
          disabled={loading}
        >
          Đăng nhập
        </Button>
        
        <p className="text-center text-sm text-zinc-600">
          Bạn chưa có tài khoản?{" "}
          <span
            className="text-primaryBlue cursor-pointer"
            onClick={() => setState("register")}
          >
            Đăng ký ngay
          </span>
        </p>
      </form>
    </Form>
  );
};
