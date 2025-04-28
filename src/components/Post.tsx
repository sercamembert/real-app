"use client";
import React, { useRef } from "react";
import { ExtendedPost } from "./PostFeed";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "./EditorOutput";
import PostLike from "./PostLike";
import CommentsCount from "./CommentsCount";
import PostShare from "./PostShare";
import { Dot } from "lucide-react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";

interface Props {
  post: ExtendedPost;
  currentUserId: string | undefined;
}

const UserPost = ({ post, currentUserId }: Props) => {
  const pRef = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full bg-white dark:bg-dark rounded-xl border border-gray-200 px-4 pt-2">
      <div className="flex items-center ">
        <Link href={`/profile/${post.authorId}`} className="flex items-center">
          <UserAvatar image={post?.author.image} w={30} h={30} />
          <p className="font-semibold font-secoundary pl-1  ">
            {post.author.name}
          </p>
        </Link>

        {/* <div className="flex text-textGray items-center">
          <Dot width={15} height={15} />
          <p className="font-secoundary text-xs">
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
        </div> */}
      </div>
      <a href={`/post/${post.id}`}>
        <h1 className="text-lg font-semibold py-2 leading-6 ">{post.title}</h1>
      </a>
      <div
        className="relative text-sm h-full max-h-[300px] w-full overflow-clip"
        ref={pRef}
      >
        <EditorOutput content={post.content} />
        {pRef.current?.clientHeight === 300 ? (
          <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white dark:from-dark to-transparent " />
        ) : null}
      </div>
      <div className="flex gap-4 w-full border-t border-outlineGray py-1 mt-5">
        <PostLike post={post} userId={currentUserId} />
        <a href={`/post/${post.id}`}>
          <CommentsCount commentsCount={post.comments.length} />
        </a>
        <PostShare path={`https://real-gules.vercel.app/post/${post.id}`} />
      </div>
    </div>
  );
};

export default UserPost;
