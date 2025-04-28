"use client";
import { MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

interface Props {
  commentsCount: number;
}

const CommentsCount = ({ commentsCount }: Props) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-inherit dark:text-background dark:hover:bg-zinc-900 cursor-pointer hover:bg-gray-200 p-1 rounded-xl font-semibold ">
      <MessageSquare color={theme === "dark" ? "white" : "black"} />
      {commentsCount}
    </div>
  );
};

export default CommentsCount;
