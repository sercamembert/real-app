import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ListFilter } from "lucide-react";
import Link from "next/link";

interface Props {
  params: {
    input: string;
    sort: string;
    type: string;
  };
}

const SearchFilters = ({ params }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer border-none mt-2 text-textGray hover:text-dark dark:hover:text-background">
        <ListFilter className="w-[20px] h-[20px]" />
        <p className="text-m">Filters</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white mt-1 z-50 dark:bg-dark p-3 rounded-[8px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] min-w-[200px] cursor-default">
        <RadioGroup defaultValue={params.sort}>
          <div className="flex items-center space-x-2">
            <Link
              href={`/search/${params.input}/post/auto`}
              className="flex items-center gap-2"
            >
              <RadioGroupItem value="auto" />
              <p>Default</p>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/search/${params.input}/post/latest`}
              className="flex items-center gap-2"
            >
              <RadioGroupItem value="latest" />
              <p>Latest</p>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/search/${params.input}/post/like`}
              className="flex items-center gap-2"
            >
              <RadioGroupItem value="like" />
              <p>Most Liked</p>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/search/${params.input}/post/comment`}
              className="flex items-center gap-2"
            >
              <RadioGroupItem value="comment" />
              <p>Most Commented</p>
            </Link>
          </div>
        </RadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchFilters;
