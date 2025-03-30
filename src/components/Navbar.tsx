import { Bell, Home, Menu, PlusSquare } from "lucide-react";
import Search from "./Search";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
interface Props {}
import Logo from "./Logo";
import { LogoSmall } from "./Logo";
import Notifications from "./Notifications";
import getCurrentUser from "@/actions/getCurrentUser";
import { Avatar, AvatarImage } from "./ui/avatar";
import UserAvatar from "./UserAvatar";
import More from "./More";
import { db } from "@/lib/prismadb";
const Navbar = async () => {
  const currentUser = await getCurrentUser();
  const userNotifications = await db.notification.findMany({
    where: {
      userId: currentUser?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });
  return (
    <div
      className=" w-full md:w-24 lg:w-56 xl:w-80 h-16 md:h-full fixed bottom-0 md:left-0 z-10 bg-white border-t-[1px] md:border-t-0 md:border-r-[1px] border-outlineGray
    flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start px-6 md:px-2 lg:px-5 dark:bg-black
    "
    >
      <div className="flex items-center justify-between w-full md:hidden">
        <Link href="/">
          <Home width={35} height={35} />
        </Link>
        <Link href="/create">
          <PlusSquare width={35} height={35} />
        </Link>
        <Notifications notify={userNotifications} currentUser={currentUser} />
        {!currentUser ? (
          <Link href="sign-in">
            <Button>Sign In</Button>
          </Link>
        ) : (
          <Link href={`/profile/${currentUser.id}`} className="h-full">
            <UserAvatar image={currentUser?.image} w={40} h={40} />
          </Link>
        )}
      </div>

      <div className="hidden md:flex flex-col gap-3 py-3 items-center lg:items-start w-full h-full">
        <Link href="/" className="inline lg:hidden p-2">
          <LogoSmall />
        </Link>

        <Link href="/" className="hidden lg:inline p-2">
          <Logo />
        </Link>

        <Link
          href="/"
          className="flex gap-2 items-center mt-4 lg:hover:bg-gray-100 dark:lg:hover:bg-dark lg:w-full lg:p-2 lg:rounded-xl"
        >
          <Home width={35} height={35} />
          <p className="hidden text-xl font-medium lg:inline pt-1">Home</p>
        </Link>

        <Search />

        <Notifications notify={userNotifications} currentUser={currentUser} />

        <Link
          href="/create"
          className="flex lg:gap-2 items-center mt-4 lg:hover:bg-gray-100 dark:lg:hover:bg-dark lg:w-full lg:p-2 lg:rounded-xl"
        >
          <PlusSquare width={35} height={35} />
          <p className="hidden text-xl font-medium lg:inline pt-1">Create</p>
        </Link>

        {!currentUser ? (
          <Link href="/sign-in" className="w-full mt-4">
            <Button className="w-full xl:w-[60%]">
              <p className="lg:text-[18px]">Sign In</p>
            </Button>
          </Link>
        ) : (
          <Link
            href={`/profile/${currentUser.id}`}
            className="flex lg:gap-2 items-center mt-4 lg:hover:bg-gray-100 dark:lg:hover:bg-dark lg:w-full lg:p-2 lg:rounded-xl"
          >
            <Avatar className="w-[35px] h-[35px]">
              <AvatarImage
                src={
                  currentUser?.image ||
                  "https://i1.sndcdn.com/artworks-flIE8AIPtmdDD8Tb-y63vwg-t500x500.jpg"
                }
              />
            </Avatar>
            <p className="hidden text-xl font-medium lg:inline pt-1">Profile</p>
          </Link>
        )}
        <More currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Navbar;
