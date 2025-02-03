"use client";

import React, { useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ListFilter, Search } from "lucide-react";
import { Button } from "./ui/button";
import { locations, salary, experience } from "@/constants";
import { Input } from "./ui/input";

// Định nghĩa kiểu dữ liệu cho bộ lọc
interface FilterProps {
  onFilterChange: (filters: FiltersType) => void;
}

type FiltersType = {
  location?: string;
  salary?: string;
  experience?: string;
  searchQuery?: string;
};

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    location: "",
    salary: "",
    experience: "",
    searchQuery: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Hàm dùng để chọn bộ lọc (tránh re-render không cần thiết)
  const handleSelect = useCallback(
    (key: keyof FiltersType, value: string) => {
      const newFilters = { ...selectedFilters, [key]: value };
      setSelectedFilters(newFilters);
      onFilterChange(newFilters);
    },
    [selectedFilters, onFilterChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSearch = () => {
    const newFilters = { ...selectedFilters, searchQuery };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };
  const handleReset = () => {
    setSelectedFilters({
      location: "",
      salary: "",
      experience: "",
      searchQuery: "",
    });
    onFilterChange({
      location: "",
      salary: "",
      experience: "",
      searchQuery: "",
    });
    setSearchQuery("");
  };
  // Hàm dựng một Dropdown menu từ danh sách (tránh lặp code)
  const renderDropdownMenu = (
    title: string,
    key: keyof FiltersType,
    items: string[]
  ) => (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{title}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {items.map((item) => (
              <DropdownMenuItem
                className="cursor-pointer"
                key={item}
                onClick={() => handleSelect(key, item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );

  return (
    <div className="flex md:items-center md:flex-row flex-col-reverse gap-3 items-start w-full">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="px-8 py-7 !text-primaryBlue font-semibold"
            >
              <ListFilter />
              Filter
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {renderDropdownMenu("Địa điểm", "location", locations)}
            <DropdownMenuSeparator />

            {renderDropdownMenu("Mức Lương", "salary", salary)}
            <DropdownMenuSeparator />

            {renderDropdownMenu("Kinh Nghiệm", "experience", experience)}
            <DropdownMenuLabel className="cursor-pointer" onClick={handleReset}>
              Reset
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center bg-white p-2 rounded-full w-full md:w-auto">
        <Input
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Tìm kiếm"
          className="w-full md:w-[475px] lg:w-[600px] !ring-0 !outline-none !focus:ring-0 !focus:outline-none !border-none !shadow-none"
        />

        <Button
          onClick={handleSearch}
          variant="outline"
          className="px-5 py-6 rounded-full bg-primaryBlue hover:bg-primaryBlue-light hover:text-white text-white"
        >
          <Search />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default Filter;
