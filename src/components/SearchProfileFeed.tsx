import { User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";

interface Props {
  profiles: User[] | undefined;
}

const SearchProfileFeed = ({ profiles }: Props) => {
  return (
    <div className="w-full flex flex-col gap-4 pt-5">
      {profiles && profiles.length === 0 && (
        <p className="text-sm text-textGray text-center">No results...</p>
      )}
      {profiles &&
        profiles.length > 0 &&
        profiles.map((profile, index) => (
          <Link
            key={index}
            href={`/profile/${profile.id}`}
            className="flex gap-2 w-full items-center p-2 bg-gray-200 dark:bg-dark dark:hover:bg-zinc-900 hover:bg-gray-300 rounded-[8px]"
          >
            <UserAvatar h={45} w={45} image={profile.image} />
            <div className="flex flex-col">
              <p className="font-medium">{profile.name}</p>
              <p className="text-sm text-textGray">
                {profile.description && profile.description?.length > 30
                  ? `${profile.description?.substring(0, 30)}...`
                  : profile.description}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default SearchProfileFeed;
