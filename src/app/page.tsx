import getCurrentUser from "@/actions/getCurrentUser";
import Feed from "@/components/Feed";
import { db } from "@/lib/prismadb";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  const follows = await db.follows.findMany({
    where: {
      followerId: user?.id,
    },
  });

  const followedUserIds = follows.map((follow) => follow.followingId);

  const initialPosts = await db.post.findMany({
    where: {
      authorId: {
        in: followedUserIds,
      },
    },
    include: {
      author: true,
      comments: true,
      likes: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="w-[90%] md:w-[500px] lg:w-[600px] 2xl:w-[700px] flex items-center justify-center ">
      <Feed currentUserId={user?.id} initialPosts={initialPosts} />
    </div>
  );
};

export default page;
