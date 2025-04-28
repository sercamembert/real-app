"use client";
import { useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { User, Comment } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import useCustomToast from "@/hooks/use-custom-toast";
import { useSession } from "next-auth/react";

type ExtendedComment = Comment & {
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  postId: string;
}

const PostComment = ({ comment, postId }: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(`/api/post/comment`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }

        return toast({
          title: "There was a problem",
          description: "Something went wrong, please try again later",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
      setInput("");
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar image={comment.author.image} h={26} w={26} />
        <div className="ml-2 flex items-center gap-x-2 ">
          <p className="text-sm font-medium text-fark0">
            {comment.author.name}
          </p>
          <p className="max-h-40 truncate text-sm text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm  mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap mt-1">
        <div
          onClick={() => {
            if (session == null) {
              loginToast();
              return;
            }
            setIsReplying(true);
          }}
          className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 cursor-pointer hover:bg-gray-200 p-1 rounded-lg"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          <p className="text-xs">Reply</p>
        </div>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <h1 className="text-lg">Your comment</h1>
            <div className="">
              <Textarea
                id="comment"
                value={input}
                onChange={(e: any) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
                className="rounded-[11px] text-gray-600 resize-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  onClick={() => {
                    setIsReplying(false);
                    setInput("");
                  }}
                  className="dark:bg-black"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!input) return;
                    mutation.mutate({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                  isLoading={mutation.isPending}
                  disabled={input.length === 0}
                  className="dark:bg-black"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
