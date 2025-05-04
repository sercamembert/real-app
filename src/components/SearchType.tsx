"use client";
import React from "react";
import SearchFilters from "./SearchFilters";
import Link from "next/link";

interface Props {
  params: {
    input: string;
    sort: string;
    type: string;
  };
}

const SearchType = ({ params }: Props) => {
  return (
    <div className=" w-full flex items-center justify-between border-b-outlineGray pb-2 border-b ">
      <div className=" flex gap-4">
        <Link
          href={`/search/${params.input}/profile/auto`}
          className={
            params.type === "profile"
              ? "text-xl font-secoundary "
              : " text-xl font-secoundary opacity-50 "
          }
        >
          Profiles
        </Link>
        <Link
          href={`/search/${params.input}/post/${params.sort}`}
          className={
            params.type === "post"
              ? "text-xl font-secoundary "
              : " text-xl font-secoundary opacity-50 "
          }
        >
          Posts
        </Link>
      </div>
      {params.type === "post" && <SearchFilters params={params} />}
    </div>
  );
};

export default SearchType;
