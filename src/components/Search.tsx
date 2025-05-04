"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
interface Props {}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const handleSearch = () => {
    const newHistory = [searchTerm, ...searchHistory];
    setSearchHistory(newHistory);

    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    setSearchTerm("");

    location.pathname = `/search/${searchTerm}/profile/auto`;
  };

  const handleDelete = (index: number) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);

    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="md:w-full flex justify-center">
        <div className="flex lg:gap-2  items-center md:mt-4 lg:hover:bg-gray-100 dark:lg:hover:bg-dark lg:w-full lg:p-2 lg:rounded-xl cursor-pointer">
          <SearchIcon width={35} height={35} />
          <p className="hidden text-xl font-medium lg:inline pt-1">Search</p>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[0] md:w-screen max-w-[400px] max-h-[400px]  bg-white dark:bg-dark overflow-y-scroll md:min-h-screen"
        side="right"
      >
        <div className="flex flex-col w-full h-full gap-3">
          <h1 className="text-xl font-secoundary font-semibold">Search</h1>

          <div className="relative">
            <Input
              placeholder="Search"
              className="rounded-[7px] flex-grow"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleEnterKeyPress}
            />
            <div className="absolute bottom-2 right-0 pr-3 bg-inputGray">
              <SearchIcon
                className="hover:text-textGray cursor-pointer dark:text-dark dark:hover:text-textGray"
                onClick={handleSearch}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t-[1px] border-background mt-3 pt-2">
            {searchHistory.length > 0 && (
              <p className="text-sm">Search history</p>
            )}
            <div className="flex flex-col gap-2 ">
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center  bg-gray-100 dark:bg-zinc-900 rounded-[8px] text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-950"
                >
                  <div
                    className="w-[90%] h-full p-3 break-words overflow-clip text-dark dark:text-background"
                    onClick={() => {
                      setSearchTerm(term);
                    }}
                  >
                    {term}
                  </div>
                  <button onClick={() => handleDelete(index)}>
                    <X className="hover:text-textGray cursor-pointer flex justify-center mr-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Search;
