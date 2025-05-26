"use client";
import React, { useCallback, useEffect, useState } from "react";
import Card from "./Card";
import Filter from "./Filter";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";

type FiltersType = {
  location?: string;
  salary?: string;
  experience?: string;
  searchQuery?: string;
};
const HomeLayout = () => {
  const [filters, setFilters] = useState<FiltersType>({
    location: "",
    salary: "",
    experience: "",
    searchQuery: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackendUp = async () => {
      const response = await fetch(
        process.env.BACKEND_URL || "https://it-job-1.onrender.com/api/v1"
      );
      if (response.ok) {
        toast.success("Backend is up and running");
      } else {
        toast.error("Backend is down");
      }
    };
    fetchBackendUp();
  }, []);
  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const fetchJobPost = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "6",
        ...filters,
      });
      const response = await fetch(`/api/job-post?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job posts");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.log("Error fetching job posts:", error);
      toast.warning("Có lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);
  const { data: jobs, error } = useApi(fetchJobPost);
  console.log("jobs", jobs);

  return (
    <>
      <Filter onFilterChange={handleFilterChange} />
      <Card
        jobs={jobs}
        error={error}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default HomeLayout;
