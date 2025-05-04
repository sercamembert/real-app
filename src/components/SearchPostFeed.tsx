import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/prismadb";
import React from "react";
import UserPost from "./Post";

interface Props {
  params: {
    input: string;
    sort: string;
    type: string;
  };
}
const SearchPostFeed = async ({ params }: Props) => {
  const currentUser = await getCurrentUser();
  let orderBy = {};

  if (params.sort === "latest") {
    orderBy = { createdAt: "desc" };
  } else if (params.sort === "like") {
    orderBy = { likes: { _count: "desc" } };
  } else if (params.sort === "comment") {
    orderBy = { comments: { _count: "desc" } };
  }

  const posts = await db.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: params.input,
          },
        },
        {
          content: {
            equals: params.input,
          },
        },
        {
          comments: {
            some: {
              text: {
                contains: params.input,
              },
            },
          },
        },
      ],
    },
    include: {
      author: true,
      comments: true,
      likes: true,
    },
    orderBy: orderBy,
  });
  return (
    <ul className="flex w-full flex-col col-span-2 space-y-6 pt-5">
      {posts && posts.length === 0 && (
        <p className="text-sm text-textGray ">No results...</p>
      )}
      {posts &&
        posts?.map((post, index) => (
          <UserPost key={post.id} post={post} currentUserId={currentUser?.id} />
        ))}
    </ul>
  );
};

export default SearchPostFeed;
