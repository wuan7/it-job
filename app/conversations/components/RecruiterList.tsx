import { useEffect, useState } from "react";
import { user } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";
const RecruiterList = () => {
  const { user } = useUserContext();

  const router = useRouter();
  const [recruiterList, setRecruiterList] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSendMessage = async (recruiterId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversation", {
        method: "POST",
        body: JSON.stringify({
          recruiterId,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to send message");
      }
      const data = await response.json();
      router.push(`/conversations/${data.data._id}`);
    } catch (error) {
      console.error("Failed to fetch recruiter list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecruiterList = async () => {
      try {
        const response = await fetch("/api/cv/recruiter-for-message");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setRecruiterList(data.data);
        console.log("recruiters", data);
      } catch (error) {
        console.error("Failed to fetch recruiter list:", error);
      }
    };

    const fetchCandidateList = async () => {
      try {
        const response = await fetch("/api/message/candidate");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setRecruiterList(data.data);
        console.log("candidates", data);
      } catch (error) {
        console.error("Failed to fetch candidate list:", error);
      }
    };

    if (user?.role === "recruiter") {
      fetchCandidateList();
      return;
    } else {
      fetchRecruiterList();
      return;
    }
  }, [user?.role]);

  if (!recruiterList) return null;
  return (
    <div className="flex flex-col gap-y-2 mt-2">
      {recruiterList.map((recruiter) => (
        <div key={recruiter._id} className="flex gap-x-2">
          <Avatar>
            <AvatarImage
              src={recruiter.logoInfo?.url}
              alt="avatar"
              className="object-contain rounded-full border border-white"
            />
            <AvatarFallback>
              {recruiter.companyName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h5 className="text-sm">{recruiter.companyName}</h5>
            <p className="text-xs">{recruiter.email}</p>
          </div>
          <div className="ml-auto">
            <Button
              className="bg-primaryBlue hover:bg-primaryBlue-light text-white rounded-3xl text-xs"
              onClick={() => handleSendMessage(recruiter._id)}
              disabled={loading}
            >
              Nhắn tin
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecruiterList;
