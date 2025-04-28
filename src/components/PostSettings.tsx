"use client";
import { MoreVertical, Trash2 } from "lucide-react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { DeleteRequest } from "@/lib/validators/delete";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
  userId: string;
}

const PostSettings = ({ postId, userId }: Props) => {
  const router = useRouter();
  const postDelete = useMutation({
    mutationFn: async ({ postId, userId }: DeleteRequest) => {
      const payload: DeleteRequest = { postId, userId };
      const { data } = await axios.patch("/api/post/delete", payload);
      return data;
    },
    onError: (err) => {
      return toast({
        title: "Something went wrong",
        description: "Can't delete post, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push("/");
      return toast({
        description: "Post has been deleted.",
      });
    },
  });

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <MoreVertical className="hover:text-textGray cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white dark:bg-dark p-0 mt-1 cursor-pointer rounded-[8px]">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-950 rounded-[8px]">
                <Trash2 />
                <p>Delete post</p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background dark:bg-dark dark:border dark:border-gray-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-dark dark:text-background">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-dark dark:text-background">
                  This action cannot be undone. This will permanently delete
                  post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-red-300 dark:bg-red-600 rounded-[8px]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="dark:bg-black"
                  onClick={() => {
                    postDelete.mutate({ postId, userId });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PostSettings;
