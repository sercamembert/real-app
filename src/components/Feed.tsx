"use client";
import { Comment, Like, Post, User } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import UserPost from "./Post";

export type ExtendedPost = Post & {
  likes: Like[];
  comments: Comment[];
  author: User;
};
interface Props {
  currentUserId: string | undefined;
  initialPosts: ExtendedPost[];
}
const Feed = ({ currentUserId, initialPosts }: Props) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["infinite-query"],
      queryFn: async ({ pageParam = 1 }) => {
        const query = `/api/posts/feed?limit=${10}&page=${pageParam}`;

        const { data } = await axios.get(query);
        return data as ExtendedPost[];
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages: any) => {
        return allPages.length + 1;
      },
    });

  useEffect(() => {
    if (entry?.isIntersecting) {
      if (!hasNextPage) return;
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);
  const pages = data?.pages ?? [initialPosts];

  const posts =
    pages.reduce((acc, page) => acc.concat(page), []) ?? initialPosts;
  return (
    <ul className="w-full flex flex-col col-span-2 space-y-6">
      {posts &&
        posts?.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <li key={index} ref={ref}>
                <UserPost post={post} currentUserId={currentUserId} />
              </li>
            );
          } else {
            return (
              <UserPost key={index} post={post} currentUserId={currentUserId} />
            );
          }
        })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  );
};

export default Feed;
