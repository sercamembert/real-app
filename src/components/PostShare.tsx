"use client";
import { toast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

interface Props {
  path: string;
}

const PostShare = ({ path }: Props) => {
  const copyToClipboard = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    toast({
      description: "Copied to clipboard.",
    });
  };
  const { theme } = useTheme();
  return (
    <div className="flex cursor-pointer bg-gray-100 hover:bg-gray-200 p-1 rounded-xl dark:bg-inherit dark:text-background dark:hover:bg-zinc-900 ">
      <Share2
        color={theme === "dark" ? "white" : "black"}
        onClick={() => {
          copyToClipboard(path);
        }}
      />
    </div>
  );
};

export default PostShare;
