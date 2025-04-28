"use client";
import { FC, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import useCustomToast from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const comment = useMutation({
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
      setInput("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <h1 className="text-xl">Your comment</h1>
      <div className="mt-1">
        <Textarea
          id="comment"
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
          className="rounded-[11px] text-gray-600 resize-none"
        />
        <div className="mt-2 flex justify-end">
          <Button
            isLoading={comment.isPending}
            disabled={input.length === 0}
            onClick={() => {
              comment.mutate({ postId, text: input, replyToId });
            }}
            className="dark:bg-black"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
