"use client";
import ProfileForm from "./ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useDialog } from "../contexts/DialogContext";
import AvatarModal from "@/components/AvatarModal";
import { useUserContext } from "../contexts/UserContext";

const ProfilePage = () => {
  const { openDialog } = useDialog("avatar");
  const { user } = useUserContext();
 

  const handleUploadAvatar = () => {
    openDialog();
  };

  return (
    <>
    <div className="max-w-6xl mx-auto p-5">
      <div className="flex md:flex-row flex-col-reverse gap-y-5 md:gap-x-5">
        <div className="w-full md:w-2/3">
          <div className="p-5 bg-white space-y-2">
            <h1 className="font-bold text-xl">Cài đặt thông tin cá nhân</h1>
            <ProfileForm />
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="p-5 bg-white space-y-2">
            <div className="flex items-center gap-x-3">
              <div className="relative">
                <Avatar className="size-20 ">
                  <AvatarImage src={user?.role === "recruiter" ? user?.logoInfo?.url  : user?.avatarInfo?.url} alt="avatar" className="object-contain border rounded-full"/>
                  <AvatarFallback>
                    {user?.role === "recruiter" ? user?.companyName?.charAt(0).toUpperCase() : user?.fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 size-6 p-1 flex justify-center items-center bg-primaryBlue text-white rounded-full cursor-pointer">
                <Camera  onClick={handleUploadAvatar}/>
                </div>
              </div>
              <div className="space-y-1 ">
                <p className="text-sm">Chào bạn trở lại,</p>
                <h1 className="font-semibold">{user?.role === "recruiter" ? user?.companyName : user?.fullName}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AvatarModal />
    </>
  );
};

export default ProfilePage;
