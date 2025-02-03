import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useUserContext } from "@/app/contexts/UserContext";


const Sidebar = () => {
  const { user, fetchCurrentUser } = useUserContext();
  return (
    <Sheet>
      <SheetTrigger>
        <Button  className="sm:hidden flex bg-primaryBlue-light hover:bg-primaryBlue-dark">
          <Menu className="size-8 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <div className="mt-3 flex-1">
          
          <div className="flex items-center gap-x-2">
            <Avatar className="size-16 border border-primaryBlue">
              <AvatarImage src="/logo-bg.jpg" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-primaryBlue">{user?.fullName}</h3>
              <p className="text-muted-foreground text-sm">
                Mã ứng viên: <span className="text-black">{user?._id}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <ul className="list-none space-y-2">
              <li className="bg-primaryBlue hover:bg-primaryBlue-light py-2 px-4  cursor-pointer">
                <Link href="/" className="text-white">
                  Việc làm đã ứng tuyển
                </Link>
              </li>
              <li className="bg-primaryBlue hover:bg-primaryBlue-light py-2 px-4  cursor-pointer">
                <Link href="/" className="text-white">
                  Việc làm đã lưu
                </Link>
              </li>
              
            </ul>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            href="/logout"
            className="block text-center py-2 px-4 rounded-3xl bg-primaryBlue hover:bg-primaryBlue-light text-white "
            onClick={() => fetchCurrentUser}
          >
            Đăng xuất
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
