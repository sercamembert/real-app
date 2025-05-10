import { Comment, Follows, Post, User } from "@prisma/client";
import React from "react";
import UserAvatar from "./UserAvatar";
import UserFollow from "./UserFollow";
import { db } from "@/lib/prismadb";
import { Settings } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Image from "next/image";

export type ExtendedPost = Post & {
  comments: Comment[];
};

export type ExtendedUser = User & {
  Post: ExtendedPost[];
};

interface Props {
  user: ExtendedUser;
  currentUser: User | undefined | null;
}

const UserProfile = async ({ user, currentUser }: Props) => {
  const follows = await db.follows.findMany({
    where: {
      followingId: user.id,
    },
  });

  const following = await db.follows.findMany({
    where: {
      followerId: user.id,
    },
  });
  return (
    <div className="h-full w-full flex justify-center gap-3 ">
      <div className="min-w-[80px] max-h-[80px] w-[80px] h-[80px] flex-grow">
        <Image
          src={
            user.image ||
            "https://i1.sndcdn.com/artworks-flIE8AIPtmdDD8Tb-y63vwg-t500x500.jpg"
          }
          alt="user avatar"
          className="w-full aspect-square h-full rounded-[50%]"
          width={80}
          height={80}
        />
      </div>

      <div className="h-full flex flex-col w-full relative overflow-clip">
        <div className="flex gap-3 items-center">
          <h1 className="font-secoundary md:text-2xl font-semibold">
            {user.name}
          </h1>
          {currentUser?.id !== user.id && (
            <UserFollow
              user={user}
              currentUserId={currentUser?.id}
              follows={follows}
            />
          )}
        </div>
        <div className="flex gap-1">
          <p className="text-xs md:text-sm">Posts:{user.Post.length}</p>
          <p className="text-xs md:text-sm">Followers:{follows?.length}</p>
          <p className="text-xs md:text-sm">Following:{following.length}</p>
        </div>
        <p className="text-xs md:text-sm pt-2 break-words w-auto whitespace-pre-wrap">
          {user.description}
        </p>
      </div>
      <div></div>
      {user.id === currentUser?.id && (
        <Link href={"/settings"} className="ml-auto h-[20px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Settings className="ml-auto hover:text-textGray" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      )}
    </div>
  );
};

export default UserProfile;
