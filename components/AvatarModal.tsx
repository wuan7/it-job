"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/app/contexts/DialogContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import { useUserContext } from "@/app/contexts/UserContext";


const AvatarModal = () => {
  const { isOpen, closeDialog } = useDialog("avatar");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchCurrentUser } = useUserContext();
  const handleUploadAvatar = async () => {
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh đại diện lên");
      return;
    }
    try {
        setLoading(true);
      const formData = new FormData();

      if (files.length > 0) {
        formData.append("file", files[0]);
      }
     
      const response = await fetch("/api/auth/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      fetchCurrentUser();
      console.log("Upload image successfully:", result);
      toast.success("Tải ảnh thành công");
      closeDialog();
    } catch (error) {
      console.log("Error upload avatar:", error);
      toast.error("Tải ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ảnh đại diện</DialogTitle>
        </DialogHeader>
        <div>
          <div  className="space-y-8">
            <ImageUpload files={files} setFiles={setFiles} loading={loading}/>
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
                onClick={handleUploadAvatar}
                disabled={loading}
              >
                Lưu
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarModal;
