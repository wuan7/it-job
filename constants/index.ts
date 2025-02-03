export const locations = ["Ngẫu nhiên", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
export const salary = [
  "Ngẫu nhiên",
  "Dưới 10 Triệu",
  "Từ 10-15 Triệu",
  "Từ 15-20 Triệu",
  "Từ 20-25 Triệu",
  "Từ 25-30 Triệu",
  "Từ 30-50 Triệu",
  "Trên 50 Triệu",
  "Thỏa thuận",
];
export const experience = [
  "Ngẫu nhiên",
  "Dưới 1 năm",
  "1 năm",
  "2 năm",
  "3 năm",
  "4 năm",
  "5 năm",
  "Trên 5 năm",
];

export type user = {
  fullName?: string;
  email: string;
  phone?: string;
  password: string;
  _id: string;
  avatarInfo?: {
    url: string;
    publicId: string;
  };
  logoInfo?: {
    url: string;
    publicId: string;
  };
  companyName?: string;
  description?: string;
  address?: string;
  employeeCount?: number;
  website?: string;
  role: "user" | "recruiter" | "admin";
};
export type jobPosts = {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  positionLevel: string;
  vacancies: number;
  workAddress: string;
  workTime: string;
  applicationDeadline: Date;
  category: string;
  field: string;
  benefits: string[];
  requirements: string[];
  jobDescription: string[];
  candidateRequirements: string[];
  isSaved?: boolean;
  createdAt: Date;
  createdBy: {
    address: string;
    companyName: string;
    createdAt: Date;
    description: string;
    employeeCount: number;
    logoInfo: {
      url: string;
      publicId: string;
    };
    _id: string;
  };
  updatedAt: Date;
  website: string;
  experience: string;
  genderPreference: string;
  receivedBy: string;
};

export type cvList = {
  _id: string;
  coverLetter: string;
  createdAt: Date;
  createdBy: {
    _id: string;
  };
  cvInfo: {
    publicId: string;
    url: string;
    fileName: string;
  };
  email: string;
  fullName: string;
  phone: string;
  status: string;
  jobPostId: {
    applicationDeadline: Date;
    benefits: string[];
    candidateRequirements: string[];
    category: string;
    createdAt: Date;
    createdBy: {
      companyName: string;
      logoInfo: {
        url: string;
        publicId: string;
      };
    };
    experience: string;
    field: string;
    genderPreference: string;
    jobDescription: string[];
    jobType: string;
    location: string;
    positionLevel: string;
    salary: string;
    title: string;
    updatedAt: Date;
    vacancies: number;
    workAddress: string;
    workTime: string;
    _id: string;
  };
  receivedBy: string;
};

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

export type Notification = {
  _id: string;
  userId: string;
  recruiterId: string;
  message: string;
  isReadByRecruiter: boolean;
  isReadByUser: boolean;
  submissionId: {
    _id: string;
    fullName: string;
    email: string;
    jobPostId: {
      _id: string;
      title: string;
    };
    receivedBy: {
      _id: string;
      companyName: string;
    }
  };
  status: "pending" | "seen" | "not_suitable" | "suitable";
  responseTime: Date;
  createdAt: Date;
};

export type Conversation = {
  _id: string;
  applicanId: string;
  employerId: {
   
    logoInfo: {
      url: string;
    }
    fullName: string;
    companyName: string;
    email: string;
    _id: string;
  };
  createdAt: Date;
}

export type Message = {
  _id: string;
  conversationId: string;
  senderId: {
    avatarInfo: {
      url: string;
    },
    fullName: string;
    _id: string;
  }
  content: string;
  createdAt: Date;
}
