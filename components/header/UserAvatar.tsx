import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BriefcaseBusiness, Heart, LogOut, SquarePen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserContext } from "@/app/contexts/UserContext";

const UserAvatar = () => {
  const { user, logout } = useUserContext();
  const router = useRouter();
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    if (res.status !== 200) {
      toast.success("Đăng xuất thất bại");
    }
    logout();
    toast.success("Đăng xuất thành công");
    router.push("/auth");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={user?.role === "recruiter" ? user?.logoInfo?.url  : user?.avatarInfo?.url} alt="avatar" className="object-contain rounded-full border border-white "/>
          <AvatarFallback>
          {user?.role === "recruiter" ? user?.companyName?.charAt(0).toUpperCase() : user?.fullName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
       
        
        <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
        <SquarePen className="text-primaryBlue size-5" />
          <Link className="font-normal text-primaryBlue" href={`/profile`}>
            Cài đặt thông tin cá nhân
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
          <BriefcaseBusiness className="text-primaryBlue size-5" />
          <Link className="font-normal text-primaryBlue" href={`/applied-jobs`}>
            Việc làm đã ứng tuyển
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
          <Heart className="text-primaryBlue size-5" />
          <Link className="font-normal text-primaryBlue" href={`/saved-jobs`}>
            Việc làm đã lưu
          </Link>
        </DropdownMenuItem>
        {user?.role === "recruiter" && (
          <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
          <Heart className="text-primaryBlue size-5" />
          <Link className="font-normal text-primaryBlue" href={`/manage`}>
            Quản lý
          </Link>
        </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer" onClick={handleLogout}>
          <LogOut className="text-primaryBlue size-5" />
          <p className="text-primaryBlue">Đăng xuất</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
