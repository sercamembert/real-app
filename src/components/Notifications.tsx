"use client";
import { Notification, User } from "@prisma/client";
import { Bell, Dot } from "lucide-react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { formatTimeToNow } from "@/lib/utils";
import { useState, useEffect } from "react";

type userNotification = Notification & {
  user: User;
};

interface Props {
  notify: userNotification[];
  currentUser: User | undefined | null;
}

const Notifications = ({ notify, currentUser }: Props) => {
  const [isWideScreen, setIsWideScreen] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Popover>
      <PopoverTrigger className="md:w-full flex justify-center">
        <div className="flex lg:gap-2  items-center md:mt-4 lg:hover:bg-gray-100 dark:lg:hover:bg-dark lg:w-full lg:p-2 lg:rounded-xl cursor-pointer">
          <Bell width={35} height={35} />
          <p className="hidden text-xl font-medium lg:inline pt-1">
            Notifications
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-screen max-w-[500px] max-h-[400px]  bg-white dark:bg-dark overflow-y-scroll 
       md:min-h-screen"
        side={isWideScreen ? "right" : "bottom"}
      >
        <div className="flex flex-col w-full h-full ">
          <h1 className="text-xl font-secoundary font-semibold">
            Notifications
          </h1>
          <div className="h-full w-full flex flex-col gap-2 pt-5">
            {currentUser &&
              notify.map((notification, key) => (
                <Link
                  key={key}
                  href={
                    notification.postId ? `/post/${notification.postId}` : ""
                  }
                  className="w-full flex items-center hover:bg-gray-100 p-2 rounded-xl dark:hover:bg-zinc-950"
                >
                  <UserAvatar image={notification.user.image} w={30} h={30} />
                  <p className="pl-2">{notification.content}</p>
                  <div className="flex text-textGray items-center">
                    <Dot width={15} height={15} />
                    <p className="font-secoundary text-xs">
                      {formatTimeToNow(new Date(notification.createdAt))}
                    </p>
                  </div>
                </Link>
              ))}
            {notify.length == 0 ||
              (!currentUser && (
                <div>
                  <p>There is no notifications yet...</p>
                </div>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
