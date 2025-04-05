"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogOut, Menu, Settings } from "lucide-react";
import React from "react";
import ChangeTheme from "./ChangeTheme";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "@prisma/client";

interface Props {
  currentUser: User | null;
}

const More = ({ currentUser }: Props) => {
  return (
    <>
      <div className="flex lg:gap-2 items-center md:mt-4 lg:hover:bg-gray-100 dark:lg:hover:bg-dark lg:w-full lg:p-2 lg:rounded-xl cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex lg:gap-2 items-cente lg:w-full lg:rounded-xl cursor-pointer border-none">
            <Menu width={35} height={35} />
            <p className="hidden text-xl  lg:inline pt-1">More</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" bg-white dark:bg-dark p-4 rounded-[8px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mr-3 mt-1 md:mr-0 md:ml-8  lg:w-[250px] xl:ml-0 min-w-[200px] cursor-default">
            {currentUser && (
              <Link href="/settings">
                <DropdownMenuItem className="py-3 flex gap-3 items-center borde-none outline-none hover:text-outlineGray cursor-pointer">
                  <Settings className="w-[20px] h-[20px]" />
                  Settings
                </DropdownMenuItem>
              </Link>
            )}

            <DropdownMenuItem className="py-3 borde-none outline-none hover:text-outlineGray cursor-pointer">
              <ChangeTheme />
            </DropdownMenuItem>
            {currentUser && (
              <DropdownMenuItem
                className="py-3 flex gap-3 borde-none outline-none hover:text-outlineGray cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOut className="w-[20px] h-[20px]" />
                Log out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default More;
