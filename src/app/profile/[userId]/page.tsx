import getCurrentUser from "@/actions/getCurrentUser";
import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { db } from "@/lib/prismadb";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    userId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const userId = params.userId;
  const currentUser = await getCurrentUser();

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Post: {
        include: {
          comments: true,
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }
  const postCount = user.Post.length;

  const posts = await db.post.findMany({
    where: {
      authorId: user?.id,
    },
    include: {
      comments: true,
      likes: true,
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: postCount < 5 ? postCount : 5,
  });

  return (
    <div className="h-full w-full md:w-[600px] 2xl:w-[700px] flex flex-col gap-2">
      <UserProfile user={user} currentUser={currentUser} />
      <div className="border-b my-1 border-outlineGray w-full pt-5"></div>
      <PostFeed
        initialPosts={posts}
        currentUserId={currentUser?.id}
        postCount={postCount}
        userId={userId}
      />
    </div>
  );
};

export default page;
