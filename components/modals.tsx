"use client";

import { useEffect, useState } from "react";
// import UploadDialog from "./UploadDialog";
export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      {/* <UploadDialog /> */}
    </>
  );
};