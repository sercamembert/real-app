"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
interface Props {}

const Searchbar = () => {
  const [input, setInput] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    // Pobierz historię wyszukiwania z local storage przy załadowaniu komponentu
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const addToSearchHistory = (term: string) => {
    const newHistory = [term, ...searchHistory];
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleSearch = () => {
    addToSearchHistory(input);
    setInput("");
    router.push(`/search/${input}/profile/auto`);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative ">
      <Input
        type="text"
        placeholder="Search recipes..."
        className="mx-auto w-[100%] sm:w-[350px] rounded-[6px] pr-10"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleEnterKeyPress}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 ">
        <Search
          className="h-5 w-5 cursor-pointer"
          color="#828282"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default Searchbar;
