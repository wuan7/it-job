"use client";
import StickyBox from "react-sticky-box";
import RecruiterList from "./components/RecruiterList";

const conversationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-6xl mx-auto min-h-screen flex flex-col">
      <div className="flex flex-grow border items-start">
        <StickyBox
          offsetTop={15}
          offsetBottom={10}
          className="hidden md:block w-1/3"
        >
          <div className=" border-r-2">
            <h1 className="font-bold text-sm">Tin tuyển dụng đã ứng tuyển</h1>
            <RecruiterList />
          </div>
        </StickyBox>
        <div className="md:w-2/3 w-full flex flex-col min-h-screen">
            {children}
        </div>
      </div>
    </div>
  );
};

export default conversationLayout;
